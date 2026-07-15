# AgriPilot AI — Backend (FastAPI)

Implements the exact API contract in the frontend README, including the
**asynchronous scan pipeline** (`POST /api/scan` → `scanId` → poll
`GET /api/scan/{id}/status`). All responses are camelCase, matching the
frontend's `src/types/` one-to-one. Errors use `{detail}`, which the frontend
already parses.

## Run it

```bash
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env                                 # set SECRET_KEY at minimum
uvicorn app.main:app --reload --port 8000
```

Interactive docs: http://localhost:8000/docs
Frontend: turn OFF the "Demo data" pill (or set `VITE_USE_MOCKS=false`) — Vite
proxies `/api` to port 8000.

## Mock mode (mirrors the frontend)

`MOCK_MODE=true` (default) — no external API calls; Gemini/weather/TTS return
realistic fakes so the whole stack runs with zero API keys.

`MOCK_MODE=false` — real integrations, each with an individual fallback:
a service whose key is missing still returns mock output rather than crashing.

| Service     | Used for                          | Env key              |
|-------------|-----------------------------------|----------------------|
| Gemini      | crop vision analysis + Bangla STT | `GEMINI_API_KEY`     |
| OpenWeather | 5-day forecast + spray window     | `OPENWEATHER_API_KEY`|
| ElevenLabs  | Bangla TTS for report audio       | `ELEVENLABS_API_KEY` |

TTS failure is deliberately non-fatal: `audioUrl` comes back `null` and the
frontend falls back to browser speech synthesis.

## Architecture

```
app/
  main.py               app factory, CORS, routers, /api/media/audio static mount
  config.py             env config + per-service mock decisions
  database.py models.py SQLAlchemy 2.0; SQLite default, DATABASE_URL for Postgres
  schemas.py            pydantic models, camelCase aliases (to_camel)
  core/                 bcrypt + JWT (24h expiry), get_current_user dependency
  routers/              auth, scan, report, dashboard, weather, voice, profile
  services/
    pipeline.py         background task; persists every stage transition to DB
    gemini_service.py   vision + STT via REST (httpx), JSON-strict prompt
    weather_service.py  OpenWeather → WeatherIntel + spray-window logic
    tts_service.py      ElevenLabs → media/audio/<reportId>.mp3
    decision_engine.py  vision + weather → spray zones, treatment, savings
```

### Scan pipeline

`POST /api/scan` validates and saves uploads (≤5 images, ≤8 MB each,
jpeg/png/webp), creates a `Scan` row, schedules `run_scan_pipeline` as a
FastAPI background task, and returns immediately. The pipeline writes each
stage (`uploading → analyzing → weather → deciding → generating_audio →
complete|failed`) to the DB, so polling works with any number of workers.
A watchdog in the status endpoint marks scans stale after 120s without
updates (e.g. server restarted mid-run) instead of leaving the UI stuck.

## Known limitations — read before deploying

- **BackgroundTasks is in-process.** Good for a demo/hackathon; for production
  scale or multi-instance deployments move `run_scan_pipeline` to a real queue
  (Celery/RQ/Arq). The DB-persisted status contract already supports that swap
  without frontend changes.
- **`POST /api/profile` should be `PATCH`** — kept as POST to match the
  shipped frontend.
- **JWT expiry (24h) is not handled gracefully by the frontend** — expired
  tokens produce 401 error text, not a login redirect. Frontend fix needed.
- Uploaded images are stored on local disk (`media/uploads/<scanId>/`) and
  never deleted — add a retention job or object storage before real usage.
- SQLite is fine for one process; use Postgres (`DATABASE_URL`) beyond that.
