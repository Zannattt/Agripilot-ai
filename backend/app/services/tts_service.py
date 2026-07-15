"""ElevenLabs text-to-speech for the Bangla recommendation audio.
Returns the public URL of the generated file, or None in mock mode
(the frontend then falls back to browser speech synthesis)."""
from pathlib import Path

import httpx

from ..config import AUDIO_DIR, ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID, tts_is_mock

TTS_URL = "https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"


def synthesize_bangla(text_bn: str, report_id: str) -> str | None:
    if tts_is_mock():
        return None

    out_path: Path = AUDIO_DIR / f"{report_id}.mp3"
    body = {
        "text": text_bn,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.75},
    }
    headers = {"xi-api-key": ELEVENLABS_API_KEY, "Accept": "audio/mpeg"}
    try:
        with httpx.Client(timeout=60) as client:
            res = client.post(TTS_URL.format(voice_id=ELEVENLABS_VOICE_ID), json=body, headers=headers)
            res.raise_for_status()
        out_path.write_bytes(res.content)
        return f"/api/media/audio/{report_id}.mp3"
    except httpx.HTTPError:
        # Audio is a nice-to-have; never fail the whole pipeline over it.
        return None
