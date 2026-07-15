from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..core.deps import get_current_user
from ..database import get_db
from ..models import Report, User
from ..schemas import DashboardData
from .report import _summary

router = APIRouter(tags=["dashboard"])


@router.get("/dashboard", response_model=DashboardData, response_model_by_alias=True)
def dashboard(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = db.scalars(
        select(Report)
        .where(Report.user_id == user.id, Report.disease != "pending")
        .order_by(Report.created_at.desc())
    ).all()

    total = len(rows)
    money = sum(r.money_saved_bdt for r in rows)
    co2 = sum(r.co2_saved_kg for r in rows)
    avg_saved = round(sum(r.pesticide_saved_pct for r in rows) / total) if total else 0
    health = rows[0].health_score if rows else 0

    return DashboardData(
        health_score=health,
        total_scans=total,
        pesticide_saved_pct=avg_saved,
        money_saved_bdt=money,
        co2_saved_kg=co2,
        recent_reports=[_summary(r) for r in rows[:6]],
    )
