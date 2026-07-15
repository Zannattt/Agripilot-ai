# AgriPilot AI — Frontend

Voice-first AI precision agriculture copilot. React 18 + TypeScript + Vite, no UI framework —
the design system lives in `src/styles/` (tokens, base, components, landing, app).

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

The app starts in **mock mode** (in-memory fake backend), so it runs standalone with realistic
data: seeded scan history, weather, and a simulated async scan pipeline. Any email/password
signs in.

## Mock mode ↔ real API

Three ways to control it (highest priority first):

1. **UI toggle** — the "Demo data / Live API" pill in the navbar (persists in localStorage).
2. **Env var** — set `VITE_USE_MOCKS=false` in `.env` to default to real requests.
3. **Default** — mocks ON, because the FastAPI backend doesn't exist yet.

When mock mode is off, requests go to `/api/*`, which `vite.config.ts` proxies to
`http://localhost:8000` (FastAPI). A `Bearer` token from login is attached automatically.

## API contract the frontend expects

```
POST /api/auth/login        { email, password }            -> { token, user }
POST /api/auth/register     { name, email, password }      -> { token, user }
POST /api/scan              multipart: images[], voice?    -> { scanId }          # returns immediately
GET  /api/scan/:id/status                                  -> ScanStatus          # poll every 1.5s
GET  /api/report/:id                                       -> Report
GET  /api/history                                          -> ReportSummary[]
GET  /api/dashboard                                        -> DashboardData
GET  /api/weather                                          -> WeatherIntel
POST /api/voice             multipart: voice               -> { transcript }
POST /api/profile           Partial<User>                  -> User
```

**Deliberate change from the original spec:** `POST /api/scan` is **asynchronous**. The pipeline
(Gemini Vision → weather → decision engine → ElevenLabs TTS) takes tens of seconds; a blocking
request would hit timeouts and give the UI nothing to show. The backend must return a `scanId`
immediately and expose `GET /api/scan/:id/status` with:

```ts
{ scanId, stage: 'queued'|'uploading'|'analyzing'|'weather'|'deciding'|'generating_audio'|'complete'|'failed',
  progressPct, message, reportId?, error? }
```

Types for every payload are in `src/types/`.

## Structure

```
src/
  components/   common (Button, Card, Modal, Navbar…), voice, upload, dashboard, landing
  pages/        Home, Login, Register, Dashboard, Scan, Report, History, NotFound
  layouts/      MainLayout (navbar, mobile bottom nav + voice FAB), AuthLayout
  hooks/        useVoice (MediaRecorder + live level), useUpload, useWeather,
                useScanPolling, useAuth, useReveal, useCountUp
  services/     api.ts (client + mock toggle), authService, aiService, weatherService,
                reportService, voiceService, mock/ (in-memory backend)
  context/      AuthContext, ScanContext, ThemeContext (dark/light)
  types/        user, crop, report, weather, scan
  utils/        constants, helpers, formatter, validators
  styles/       tokens, base, components, landing, app
```

## Notes

- Dark/light mode: navbar toggle, persisted, driven by CSS variables on `<html data-theme>`.
- Report audio: real backend supplies an ElevenLabs `audioUrl`; in mock mode the player falls
  back to the browser's Bangla speech synthesis when available.
- Voice recording needs HTTPS or localhost (MediaRecorder + getUserMedia).
- Accessibility: keyboard-focusable dropzone/table rows, aria labels on icon buttons,
  `prefers-reduced-motion` respected across all animations.
