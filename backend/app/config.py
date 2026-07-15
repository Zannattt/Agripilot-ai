# """Central configuration. Plain os.getenv keeps dependencies minimal."""
# import os
# from pathlib import Path

# BASE_DIR = Path(__file__).resolve().parent.parent
# MEDIA_DIR = BASE_DIR / "media"
# UPLOAD_DIR = MEDIA_DIR / "uploads"
# AUDIO_DIR = MEDIA_DIR / "audio"
# for d in (UPLOAD_DIR, AUDIO_DIR):
#     d.mkdir(parents=True, exist_ok=True)


# def _bool(name: str, default: bool) -> bool:
#     raw = os.getenv(name)
#     if raw is None:
#         return default
#     return raw.strip().lower() in ("1", "true", "yes", "on")


# SECRET_KEY = os.getenv("SECRET_KEY", "dev-only-insecure-secret")
# DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./agripilot.db")
# ACCESS_TOKEN_EXPIRE_HOURS = int(os.getenv("ACCESS_TOKEN_EXPIRE_HOURS", "24"))
# JWT_ALGORITHM = "HS256"

# MOCK_MODE = _bool("MOCK_MODE", True)

# GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
# GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

# ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "")
# ELEVENLABS_VOICE_ID = os.getenv("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM")

# OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "")
# WEATHER_LAT = float(os.getenv("WEATHER_LAT", "24.85"))
# WEATHER_LON = float(os.getenv("WEATHER_LON", "89.37"))
# WEATHER_REGION_NAME = os.getenv("WEATHER_REGION_NAME", "Bogura, Rajshahi")

# # A scan whose status row hasn't been touched for this long is considered dead
# # (e.g. the server restarted mid-pipeline) and is marked failed on next poll.
# SCAN_STALE_SECONDS = 120

# # Deployed frontend origin for CORS, e.g. https://agripilot.vercel.app
# FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "")

# # effective per-service mock decisions
# def gemini_is_mock() -> bool:
#     return MOCK_MODE or not GEMINI_API_KEY

# def tts_is_mock() -> bool:
#     return MOCK_MODE or not ELEVENLABS_API_KEY

# def weather_is_mock() -> bool:
#     return MOCK_MODE or not OPENWEATHER_API_KEY





"""Central configuration. Plain os.getenv keeps dependencies minimal."""
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
MEDIA_DIR = BASE_DIR / "media"
UPLOAD_DIR = MEDIA_DIR / "uploads"
AUDIO_DIR = MEDIA_DIR / "audio"
for d in (UPLOAD_DIR, AUDIO_DIR):
    d.mkdir(parents=True, exist_ok=True)


def _bool(name: str, default: bool) -> bool:
    raw = os.getenv(name)
    if raw is None:
        return default
    return raw.strip().lower() in ("1", "true", "yes", "on")


SECRET_KEY = os.getenv("SECRET_KEY", "dev-only-insecure-secret")
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./agripilot.db")
# Render's managed Postgres hands out postgres:// — SQLAlchemy 2.x only
# accepts postgresql://, so normalize the scheme.
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
ACCESS_TOKEN_EXPIRE_HOURS = int(os.getenv("ACCESS_TOKEN_EXPIRE_HOURS", "24"))
JWT_ALGORITHM = "HS256"

MOCK_MODE = _bool("MOCK_MODE", True)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "")
ELEVENLABS_VOICE_ID = os.getenv("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM")

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "")
WEATHER_LAT = float(os.getenv("WEATHER_LAT", "24.85"))
WEATHER_LON = float(os.getenv("WEATHER_LON", "89.37"))
WEATHER_REGION_NAME = os.getenv("WEATHER_REGION_NAME", "Bogura, Rajshahi")

# A scan whose status row hasn't been touched for this long is considered dead
# (e.g. the server restarted mid-pipeline) and is marked failed on next poll.
SCAN_STALE_SECONDS = 120

# Deployed frontend origin for CORS, e.g. https://agripilot.vercel.app
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "")

# effective per-service mock decisions
def gemini_is_mock() -> bool:
    return MOCK_MODE or not GEMINI_API_KEY

def tts_is_mock() -> bool:
    return MOCK_MODE or not ELEVENLABS_API_KEY

def weather_is_mock() -> bool:
    return MOCK_MODE or not OPENWEATHER_API_KEY
