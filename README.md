# AgriPilot AI

Voice-first AI precision agriculture copilot.

- `frontend/` — React 18 + TypeScript + Vite (deploys to **Vercel**)
- `backend/`  — FastAPI + SQLAlchemy (deploys to **Render**, `render.yaml` blueprint included)

Each folder has its own README with run instructions, the API contract, and known limitations.

## Production wiring

Vercel serves the SPA and proxies `/api/*` to the Render service via
`frontend/vercel.json` rewrites (edit the destination to your Render URL).
This keeps API requests same-origin — no CORS issues in the browser.

Render Postgres is required in production: Render's filesystem is ephemeral,
so SQLite (and `media/` uploads + generated audio) do not survive deploys.
