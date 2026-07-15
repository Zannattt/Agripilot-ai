import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .config import AUDIO_DIR, FRONTEND_ORIGIN, MOCK_MODE
from .database import Base, engine
from .routers import auth, dashboard, profile, report, scan, voice, weather

logging.basicConfig(level=logging.INFO)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AgriPilot AI API", version="0.1.0")

# The Vite dev server proxies /api, so same-origin in dev; CORS covers direct access.
_origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
if FRONTEND_ORIGIN:
    _origins.append(FRONTEND_ORIGIN)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_prefix = "/api"
app.include_router(auth.router, prefix=api_prefix)
app.include_router(scan.router, prefix=api_prefix)
app.include_router(report.router, prefix=api_prefix)
app.include_router(dashboard.router, prefix=api_prefix)
app.include_router(weather.router, prefix=api_prefix)
app.include_router(voice.router, prefix=api_prefix)
app.include_router(profile.router, prefix=api_prefix)

# generated ElevenLabs audio -> /api/media/audio/<report_id>.mp3
app.mount("/api/media/audio", StaticFiles(directory=str(AUDIO_DIR)), name="audio")


@app.get("/api/health")
def health():
    return {"status": "ok", "mockMode": MOCK_MODE}
