from fastapi import APIRouter, Depends, HTTPException

from ..core.deps import get_current_user
from ..models import User
from ..schemas import WeatherIntel
from ..services import weather_service

router = APIRouter(tags=["weather"])


@router.get("/weather", response_model=WeatherIntel, response_model_by_alias=True)
def weather(user: User = Depends(get_current_user)):
    try:
        #return weather_service.get_weather()
        return weather_service.get_weather(user.region)
    except Exception as exc:  # noqa: BLE001 — external service boundary
        raise HTTPException(502, detail=f"Weather service unavailable: {exc}") from exc
