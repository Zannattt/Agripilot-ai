"""Combines vision analysis + weather into the final Report payload —
spray-zone map, treatment, and savings — in the exact camelCase shape
of the frontend's types/report.ts."""
import random
from datetime import datetime, timezone

from .gemini_service import VisionResult
from ..schemas import WeatherIntel

GRID_ROWS = 6
GRID_COLS = 10
FULL_FIELD_LITERS = 120

# treatment lookup; fallback used for diseases Gemini names that aren't listed
_TREATMENTS = {
    "bacterial leaf blight": ("Copper oxychloride 50 WP", "2.5 g per liter of water"),
    "rice blast": ("Tricyclazole 75 WP", "0.6 g per liter of water"),
    "brown spot": ("Mancozeb 80 WP", "2 g per liter of water"),
}
_FALLBACK_TREATMENT = ("Consult a local agronomist for the exact product", "Follow the label dosage")


def _spray_zones(affected_pct: int) -> list[dict]:
    total = GRID_ROWS * GRID_COLS
    count = max(0, min(total, round(total * affected_pct / 100)))
    picked: set[tuple[int, int]] = set()
    while len(picked) < count:
        picked.add((random.randrange(GRID_ROWS), random.randrange(GRID_COLS)))
    return [
        {"row": r, "col": c, "intensity": round(0.4 + random.random() * 0.6, 2)}
        for r, c in sorted(picked)
    ]


def _weather_note(weather: WeatherIntel) -> str:
    window = weather.spray_window
    if window.ok:
        return f"Good spray window: {window.best_time}. {window.reason}"
    return f"Hold off spraying — {window.reason} Best time: {window.best_time}."


def build_report(
    report_id: str,
    vision: VisionResult,
    weather: WeatherIntel,
    image_count: int,
) -> dict:
    affected = vision.affected_area_pct
    spot_liters = round(FULL_FIELD_LITERS * (affected / 100) * 1.4)
    saved_pct = round((FULL_FIELD_LITERS - spot_liters) / FULL_FIELD_LITERS * 100)
    health_score = max(5, min(100, 100 - affected - 5))

    recommendation = (
        f"Spot-spray only the highlighted zones ({affected}% of the field) instead of "
        f"blanket spraying. Spray during the recommended window and re-scan after 5 days."
    )
    recommendation_bn = (
        "পুরো জমিতে স্প্রে না করে শুধু চিহ্নিত জায়গাগুলোতে স্প্রে করুন। "
        "সকাল ৬টা থেকে ৯টার মধ্যে স্প্রে করুন এবং ৫ দিন পর আবার স্ক্যান করুন।"
    )
    if affected == 0:
        recommendation = "No treatment needed. The field looks healthy — re-scan in a week to stay ahead."
        recommendation_bn = "এখন কোনো স্প্রে দরকার নেই। জমি সুস্থ আছে — এক সপ্তাহ পর আবার স্ক্যান করুন।"

    name, dosage = _TREATMENTS.get(vision.disease.lower(), _FALLBACK_TREATMENT)

    return {
        "id": report_id,
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "crop": vision.crop,
        "disease": vision.disease,
        "diseaseBn": vision.disease_bn,
        "confidencePct": vision.confidence_pct,
        "severity": vision.severity,
        "affectedAreaPct": affected,
        "healthScore": health_score,
        "recommendation": recommendation,
        "recommendationBn": recommendation_bn,
        "pesticide": {
            "name": name,
            "dosage": dosage,
            "fullFieldLiters": FULL_FIELD_LITERS,
            "spotLiters": spot_liters,
        },
        "gridSize": {"rows": GRID_ROWS, "cols": GRID_COLS},
        "sprayZones": _spray_zones(affected),
        "savings": {
            "pesticideSavedPct": saved_pct,
            "moneySavedBdt": saved_pct * 42,
            "co2SavedKg": round(saved_pct * 0.35),
            "waterProtectedL": saved_pct * 18,
        },
        "weatherNote": _weather_note(weather),
        "audioUrl": None,  # filled by the pipeline after TTS
        "imageCount": image_count,
    }
