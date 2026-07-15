"""The asynchronous scan pipeline. Runs as a FastAPI background task; every
stage transition is persisted so GET /api/scan/{id}/status works regardless
of which worker handles the poll."""
import json
import logging
from pathlib import Path

from ..database import SessionLocal
from ..models import Report, Scan
from . import decision_engine, gemini_service, tts_service, weather_service

logger = logging.getLogger("agripilot.pipeline")

_STAGE_PROGRESS = {
    "uploading": 10,
    "analyzing": 30,
    "weather": 55,
    "deciding": 72,
    "generating_audio": 88,
    "complete": 100,
}


def _update(scan_id: str, stage: str, message: str, **fields) -> None:
    with SessionLocal() as db:
        scan = db.get(Scan, scan_id)
        if scan is None:
            return
        scan.stage = stage
        scan.message = message
        scan.progress_pct = _STAGE_PROGRESS.get(stage, scan.progress_pct)
        for key, value in fields.items():
            setattr(scan, key, value)
        db.commit()


def run_scan_pipeline(scan_id: str, user_id: str, image_paths: list[str], voice_path: str | None) -> None:
    try:
        paths = [Path(p) for p in image_paths]

        # 1. speech-to-text (optional)
        transcript: str | None = None
        if voice_path:
            _update(scan_id, "uploading", "Processing your voice question…")
            transcript = gemini_service.transcribe_audio(Path(voice_path))
            _update(scan_id, "uploading", "Voice processed", voice_transcript=transcript)

        # 2. vision analysis
        _update(scan_id, "analyzing", "Gemini Vision is examining leaf damage…")
        vision = gemini_service.analyze_images(paths, transcript)

        # 3. weather intelligence
        _update(scan_id, "weather", "Fetching local weather intelligence…")
        weather = weather_service.get_weather()

        # 4. decision engine
        _update(scan_id, "deciding", "Decision engine is mapping spray zones…")
        with SessionLocal() as db:
            report_row = Report(
                user_id=user_id,
                crop="rice",
                disease="pending",
                severity="low",
                health_score=0,
                money_saved_bdt=0,
                pesticide_saved_pct=0,
                co2_saved_kg=0,
                data="{}",
            )
            db.add(report_row)
            db.commit()
            report_id = report_row.id

        report_data = decision_engine.build_report(report_id, vision, weather, len(paths))

        # 5. Bangla audio (never fatal)
        _update(scan_id, "generating_audio", "Generating Bangla voice guidance…")
        report_data["audioUrl"] = tts_service.synthesize_bangla(
            report_data["recommendationBn"], report_id
        )

        with SessionLocal() as db:
            row = db.get(Report, report_id)
            if row is not None:
                row.crop = report_data["crop"]
                row.disease = report_data["disease"]
                row.severity = report_data["severity"]
                row.health_score = report_data["healthScore"]
                row.money_saved_bdt = report_data["savings"]["moneySavedBdt"]
                row.pesticide_saved_pct = report_data["savings"]["pesticideSavedPct"]
                row.co2_saved_kg = report_data["savings"]["co2SavedKg"]
                row.data = json.dumps(report_data, ensure_ascii=False)
                db.commit()

        _update(scan_id, "complete", "Report ready", report_id=report_id)

    except Exception as exc:  # noqa: BLE001 — pipeline boundary
        logger.exception("Scan %s failed", scan_id)
        _update(scan_id, "failed", "Scan failed", error=str(exc))
