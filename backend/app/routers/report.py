import json

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..core.deps import get_current_user
from ..database import get_db
from ..models import Report, User
from ..schemas import ReportSummary

router = APIRouter(tags=["reports"])


def _summary(row: Report) -> ReportSummary:
    return ReportSummary(
        id=row.id,
        created_at=row.created_at.isoformat(),
        crop=row.crop,
        disease=row.disease,
        severity=row.severity,
        health_score=row.health_score,
        money_saved_bdt=row.money_saved_bdt,
    )


@router.get("/report/{report_id}")
def get_report(report_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    row = db.get(Report, report_id)
    if row is None or row.user_id != user.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Report not found")
    # `data` is already the exact camelCase Report payload
    return JSONResponse(content=json.loads(row.data))


@router.get("/history", response_model=list[ReportSummary], response_model_by_alias=True)
def history(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = db.scalars(
        select(Report)
        .where(Report.user_id == user.id, Report.disease != "pending")
        .order_by(Report.created_at.desc())
    ).all()
    return [_summary(r) for r in rows]
