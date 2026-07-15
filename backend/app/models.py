import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from .database import Base


def _uid(prefix: str) -> str:
    return f"{prefix}_{uuid.uuid4().hex[:10]}"


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: _uid("u"))
    name: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)
    region: Mapped[str | None] = mapped_column(String, nullable=True)
    primary_crop: Mapped[str | None] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class Scan(Base):
    """One asynchronous pipeline run. The frontend polls this row's state."""

    __tablename__ = "scans"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: _uid("scan"))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True)
    stage: Mapped[str] = mapped_column(String, default="queued")
    progress_pct: Mapped[int] = mapped_column(Integer, default=0)
    message: Mapped[str] = mapped_column(String, default="Queued")
    error: Mapped[str | None] = mapped_column(String, nullable=True)
    report_id: Mapped[str | None] = mapped_column(String, nullable=True)
    image_count: Mapped[int] = mapped_column(Integer, default=0)
    voice_transcript: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)


class Report(Base):
    """Full report payload is stored as JSON text (`data`), exactly in the
    camelCase shape the frontend's types/report.ts expects. A few columns are
    duplicated for querying/sorting without parsing JSON."""

    __tablename__ = "reports"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: _uid("rep"))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True)
    crop: Mapped[str] = mapped_column(String)
    disease: Mapped[str] = mapped_column(String)
    severity: Mapped[str] = mapped_column(String)
    health_score: Mapped[int] = mapped_column(Integer)
    money_saved_bdt: Mapped[float] = mapped_column(Float)
    pesticide_saved_pct: Mapped[float] = mapped_column(Float)
    co2_saved_kg: Mapped[float] = mapped_column(Float)
    data: Mapped[str] = mapped_column(Text)  # JSON string of the full Report
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)
