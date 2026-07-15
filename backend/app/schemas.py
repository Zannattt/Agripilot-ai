"""Pydantic wire models. Field names are camelCase on the wire to match the
frontend's src/types exactly; Python code uses snake_case via aliases."""
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


# ---- auth ----
class Credentials(BaseModel):
    email: EmailStr
    password: str


class RegisterPayload(Credentials):
    name: str
    region: Optional[str] = None


class UserOut(CamelModel):
    id: str
    name: str
    email: str
    region: Optional[str] = None
    primary_crop: Optional[str] = None


class AuthResponse(CamelModel):
    token: str
    user: UserOut


class ProfileUpdate(CamelModel):
    name: Optional[str] = None
    region: Optional[str] = None
    primary_crop: Optional[str] = None


# ---- scan ----
ScanStage = Literal[
    "queued", "uploading", "analyzing", "weather", "deciding",
    "generating_audio", "complete", "failed",
]


class ScanStartResponse(CamelModel):
    scan_id: str


class ScanStatus(CamelModel):
    scan_id: str
    stage: ScanStage
    progress_pct: int
    message: str
    report_id: Optional[str] = None
    error: Optional[str] = None


# ---- reports ----
class ReportSummary(CamelModel):
    id: str
    created_at: str
    crop: str
    disease: str
    severity: str
    health_score: int
    money_saved_bdt: float


class DashboardData(CamelModel):
    health_score: int
    total_scans: int
    pesticide_saved_pct: float
    money_saved_bdt: float
    co2_saved_kg: float
    recent_reports: list[ReportSummary]


# ---- weather ----
class SprayWindow(CamelModel):
    ok: bool
    reason: str
    best_time: str


class DailyForecast(CamelModel):
    date: str
    temp_min_c: float
    temp_max_c: float
    humidity_pct: float
    rain_chance_pct: float
    wind_kph: float
    condition: Literal["sunny", "cloudy", "rain", "storm"]


class WeatherIntel(CamelModel):
    region: str
    updated_at: str
    spray_window: SprayWindow
    days: list[DailyForecast]


class TranscriptResponse(BaseModel):
    transcript: str
