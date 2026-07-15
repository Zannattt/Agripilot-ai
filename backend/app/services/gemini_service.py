"""Gemini REST integration: crop-image analysis and Bangla speech-to-text.
Falls back to realistic mock results when MOCK_MODE is on or no key is set."""
import base64
import json
import random
from dataclasses import dataclass
from pathlib import Path

import httpx

from ..config import GEMINI_API_KEY, GEMINI_MODEL, gemini_is_mock

GEMINI_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    "{model}:generateContent?key={key}"
)


@dataclass
class VisionResult:
    disease: str
    disease_bn: str
    confidence_pct: int
    severity: str          # low | moderate | high
    affected_area_pct: int
    crop: str


_MOCK_DISEASES = [
    ("Bacterial Leaf Blight", "ব্যাকটেরিয়াল লিফ ব্লাইট"),
    ("Rice Blast", "রাইস ব্লাস্ট"),
    ("Brown Spot", "ব্রাউন স্পট"),
]

_VISION_PROMPT = """You are an expert plant pathologist analyzing crop photos from a farmer in Bangladesh.
Examine ALL attached images together and respond with ONLY a JSON object, no markdown fences, with keys:
- "crop": one of "rice","wheat","potato","tomato","jute","maize"
- "disease": the most likely disease/pest name in English
- "disease_bn": the same name in Bangla
- "confidence_pct": integer 0-100
- "severity": "low", "moderate", or "high"
- "affected_area_pct": integer 0-100, your estimate of how much of the field is affected
If the images do not show a diseased crop, use disease "No disease detected", severity "low", affected_area_pct 0."""


def _mock_vision() -> VisionResult:
    disease, disease_bn = random.choice(_MOCK_DISEASES)
    severity = random.choice(["low", "moderate", "high"])
    affected = {"low": 8, "moderate": 18, "high": 34}[severity]
    return VisionResult(
        disease=disease,
        disease_bn=disease_bn,
        confidence_pct=88 + random.randint(0, 9),
        severity=severity,
        affected_area_pct=affected,
        crop="rice",
    )


def _image_part(path: Path) -> dict:
    mime = "image/png" if path.suffix.lower() == ".png" else "image/jpeg"
    data = base64.b64encode(path.read_bytes()).decode()
    return {"inline_data": {"mime_type": mime, "data": data}}


def _call_gemini(parts: list[dict]) -> str:
    url = GEMINI_URL.format(model=GEMINI_MODEL, key=GEMINI_API_KEY)
    body = {"contents": [{"parts": parts}]}
    with httpx.Client(timeout=90) as client:
        res = client.post(url, json=body)
        res.raise_for_status()
    data = res.json()
    return data["candidates"][0]["content"]["parts"][0]["text"]


def _parse_json(text: str) -> dict:
    cleaned = text.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
    return json.loads(cleaned)


def analyze_images(image_paths: list[Path], transcript: str | None = None) -> VisionResult:
    if gemini_is_mock():
        return _mock_vision()

    parts: list[dict] = [{"text": _VISION_PROMPT}]
    if transcript:
        parts.append({"text": f"The farmer described the problem as: {transcript}"})
    parts.extend(_image_part(p) for p in image_paths)

    try:
        raw = _parse_json(_call_gemini(parts))
        return VisionResult(
            disease=str(raw["disease"]),
            disease_bn=str(raw.get("disease_bn", raw["disease"])),
            confidence_pct=int(raw["confidence_pct"]),
            severity=str(raw["severity"]).lower(),
            affected_area_pct=max(0, min(100, int(raw["affected_area_pct"]))),
            crop=str(raw.get("crop", "rice")),
        )
    except (httpx.HTTPError, KeyError, ValueError, json.JSONDecodeError) as exc:
        raise RuntimeError(f"Gemini vision analysis failed: {exc}") from exc


def transcribe_audio(audio_path: Path) -> str:
    """Bangla speech-to-text via Gemini audio input."""
    if gemini_is_mock():
        return "আমার ধানের পাতায় দাগ পড়েছে"
    mime = "audio/webm" if audio_path.suffix == ".webm" else "audio/mpeg"
    parts = [
        {"text": "Transcribe this Bangla audio exactly. Respond with the transcription only."},
        {"inline_data": {"mime_type": mime, "data": base64.b64encode(audio_path.read_bytes()).decode()}},
    ]
    try:
        return _call_gemini(parts).strip()
    except httpx.HTTPError as exc:
        raise RuntimeError(f"Transcription failed: {exc}") from exc
