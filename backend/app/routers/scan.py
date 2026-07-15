from datetime import datetime, timezone
from pathlib import Path

from fastapi import (APIRouter, BackgroundTasks, Depends, File, HTTPException,
                     UploadFile, status)
from sqlalchemy.orm import Session

from ..config import SCAN_STALE_SECONDS, UPLOAD_DIR
from ..core.deps import get_current_user
from ..database import get_db
from ..models import Scan, User
from ..schemas import ScanStartResponse, ScanStatus
from ..services.pipeline import run_scan_pipeline

router = APIRouter(prefix="/scan", tags=["scan"])

MAX_IMAGES = 5
MAX_IMAGE_BYTES = 8 * 1024 * 1024
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}


@router.post("", response_model=ScanStartResponse, response_model_by_alias=True)
async def start_scan(
    background: BackgroundTasks,
    images: list[UploadFile] = File(...),
    voice: UploadFile | None = File(default=None),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not images:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, detail="At least one crop photo is required.")
    if len(images) > MAX_IMAGES:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, detail=f"Up to {MAX_IMAGES} images per scan.")

    scan = Scan(user_id=user.id, stage="queued", message="Queued", image_count=len(images))
    db.add(scan)
    db.commit()
    db.refresh(scan)

    scan_dir: Path = UPLOAD_DIR / scan.id
    scan_dir.mkdir(parents=True, exist_ok=True)

    image_paths: list[str] = []
    for i, upload in enumerate(images):
        if upload.content_type not in ALLOWED_IMAGE_TYPES:
            raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, detail=f"'{upload.filename}' is not a supported image type.")
        content = await upload.read()
        if len(content) > MAX_IMAGE_BYTES:
            raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, detail=f"'{upload.filename}' is larger than 8 MB.")
        suffix = ".png" if upload.content_type == "image/png" else ".jpg"
        path = scan_dir / f"image_{i}{suffix}"
        path.write_bytes(content)
        image_paths.append(str(path))

    voice_path: str | None = None
    if voice is not None:
        audio = await voice.read()
        if audio:
            vp = scan_dir / "question.webm"
            vp.write_bytes(audio)
            voice_path = str(vp)

    background.add_task(run_scan_pipeline, scan.id, user.id, image_paths, voice_path)
    return ScanStartResponse(scan_id=scan.id)


@router.get("/{scan_id}/status", response_model=ScanStatus, response_model_by_alias=True)
def scan_status(scan_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    scan = db.get(Scan, scan_id)
    if scan is None or scan.user_id != user.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Scan not found")

    # dead-job detection: server restarted mid-pipeline etc.
    if scan.stage not in ("complete", "failed"):
        updated = scan.updated_at
        if updated.tzinfo is None:
            updated = updated.replace(tzinfo=timezone.utc)
        age = (datetime.now(timezone.utc) - updated).total_seconds()
        if age > SCAN_STALE_SECONDS:
            scan.stage = "failed"
            scan.error = "The scan was interrupted. Please try again."
            scan.message = "Scan failed"
            db.commit()

    return ScanStatus(
        scan_id=scan.id,
        stage=scan.stage,  # type: ignore[arg-type]
        progress_pct=scan.progress_pct,
        message=scan.message,
        report_id=scan.report_id,
        error=scan.error,
    )
