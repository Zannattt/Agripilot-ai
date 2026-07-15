from pathlib import Path
from tempfile import NamedTemporaryFile

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from ..core.deps import get_current_user
from ..models import User
from ..schemas import TranscriptResponse
from ..services import gemini_service

router = APIRouter(tags=["voice"])


@router.post("/voice", response_model=TranscriptResponse)
async def transcribe(voice: UploadFile = File(...), user: User = Depends(get_current_user)):
    content = await voice.read()
    if not content:
        raise HTTPException(422, detail="Empty audio file.")
    with NamedTemporaryFile(suffix=".webm", delete=False) as tmp:
        tmp.write(content)
        tmp_path = Path(tmp.name)
    try:
        return TranscriptResponse(transcript=gemini_service.transcribe_audio(tmp_path))
    except RuntimeError as exc:
        raise HTTPException(502, detail=str(exc)) from exc
    finally:
        tmp_path.unlink(missing_ok=True)
