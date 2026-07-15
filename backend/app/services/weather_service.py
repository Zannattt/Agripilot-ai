# """OpenWeather 5-day forecast mapped to the frontend's WeatherIntel shape."""
# from datetime import datetime, timedelta, timezone

# import httpx

# from ..config import (OPENWEATHER_API_KEY, WEATHER_LAT, WEATHER_LON,
#                       WEATHER_REGION_NAME, weather_is_mock)
# from ..schemas import DailyForecast, SprayWindow, WeatherIntel

# FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast"


# def _condition(openweather_main: str) -> str:
#     main = openweather_main.lower()
#     if "thunder" in main or "storm" in main:
#         return "storm"
#     if "rain" in main or "drizzle" in main:
#         return "rain"
#     if "cloud" in main:
#         return "cloudy"
#     return "sunny"


# def _mock_weather() -> WeatherIntel:
#     now = datetime.now(timezone.utc)
#     conditions = ["sunny", "cloudy", "rain", "sunny", "cloudy"]
#     days = [
#         DailyForecast(
#             date=(now + timedelta(days=i)).isoformat(),
#             temp_min_c=24 + i % 3,
#             temp_max_c=31 + i % 4,
#             humidity_pct=68 + i * 3,
#             rain_chance_pct=70 if conditions[i] == "rain" else 15 + i * 5,
#             wind_kph=8 + i * 2,
#             condition=conditions[i],  # type: ignore[arg-type]
#         )
#         for i in range(5)
#     ]
#     return WeatherIntel(
#         region=WEATHER_REGION_NAME,
#         updated_at=now.isoformat(),
#         spray_window=SprayWindow(
#             ok=True,
#             reason="Low wind and no rain expected for the next 6 hours.",
#             best_time="Today, 6:00\u20139:00 AM",
#         ),
#         days=days,
#     )


# def _build_spray_window(days: list[DailyForecast]) -> SprayWindow:
#     today = days[0]
#     if today.rain_chance_pct >= 60:
#         return SprayWindow(
#             ok=False,
#             reason=f"High rain chance today ({int(today.rain_chance_pct)}%) — treatment would wash off.",
#             best_time="Wait for the next dry morning",
#         )
#     if today.wind_kph > 15:
#         return SprayWindow(
#             ok=False,
#             reason=f"Wind is {int(today.wind_kph)} km/h — spray would drift off-target.",
#             best_time="Early morning when wind drops",
#         )
#     return SprayWindow(
#         ok=True,
#         reason="Low wind and low rain probability in the coming hours.",
#         best_time="Today, 6:00\u20139:00 AM",
#     )


# def get_weather() -> WeatherIntel:
#     if weather_is_mock():
#         return _mock_weather()

#     params = {"lat": WEATHER_LAT, "lon": WEATHER_LON, "appid": OPENWEATHER_API_KEY, "units": "metric"}
#     with httpx.Client(timeout=20) as client:
#         res = client.get(FORECAST_URL, params=params)
#         res.raise_for_status()
#     payload = res.json()

#     # bucket 3-hourly entries into days
#     buckets: dict[str, list[dict]] = {}
#     for entry in payload.get("list", []):
#         day_key = entry["dt_txt"][:10]
#         buckets.setdefault(day_key, []).append(entry)

#     days: list[DailyForecast] = []
#     for day_key, entries in sorted(buckets.items())[:5]:
#         temps_min = min(e["main"]["temp_min"] for e in entries)
#         temps_max = max(e["main"]["temp_max"] for e in entries)
#         humidity = sum(e["main"]["humidity"] for e in entries) / len(entries)
#         rain_chance = max(e.get("pop", 0) for e in entries) * 100
#         wind_kph = max(e["wind"]["speed"] for e in entries) * 3.6
#         main = entries[len(entries) // 2]["weather"][0]["main"]
#         days.append(
#             DailyForecast(
#                 date=f"{day_key}T12:00:00+00:00",
#                 temp_min_c=round(temps_min, 1),
#                 temp_max_c=round(temps_max, 1),
#                 humidity_pct=round(humidity),
#                 rain_chance_pct=round(rain_chance),
#                 wind_kph=round(wind_kph, 1),
#                 condition=_condition(main),  # type: ignore[arg-type]
#             )
#         )

#     return WeatherIntel(
#         region=WEATHER_REGION_NAME,
#         updated_at=datetime.now(timezone.utc).isoformat(),
#         spray_window=_build_spray_window(days),
#         days=days,
#     )



"""OpenWeather 5-day forecast mapped to the frontend's WeatherIntel shape.
The forecast is fetched for the *user's registered district* (geocoded via
OpenWeather's geocoding API); env coordinates are only a last-resort fallback."""
from datetime import datetime, timedelta, timezone

import httpx

from ..config import (OPENWEATHER_API_KEY, WEATHER_LAT, WEATHER_LON,
                      WEATHER_REGION_NAME, weather_is_mock)
from ..schemas import DailyForecast, SprayWindow, WeatherIntel

FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast"
GEOCODE_URL = "https://api.openweathermap.org/geo/1.0/direct"


def _condition(openweather_main: str) -> str:
    main = openweather_main.lower()
    if "thunder" in main or "storm" in main:
        return "storm"
    if "rain" in main or "drizzle" in main:
        return "rain"
    if "cloud" in main:
        return "cloudy"
    return "sunny"


def _mock_weather(region_name: str) -> WeatherIntel:
    now = datetime.now(timezone.utc)
    conditions = ["sunny", "cloudy", "rain", "sunny", "cloudy"]
    days = [
        DailyForecast(
            date=(now + timedelta(days=i)).isoformat(),
            temp_min_c=24 + i % 3,
            temp_max_c=31 + i % 4,
            humidity_pct=68 + i * 3,
            rain_chance_pct=70 if conditions[i] == "rain" else 15 + i * 5,
            wind_kph=8 + i * 2,
            condition=conditions[i],  # type: ignore[arg-type]
        )
        for i in range(5)
    ]
    return WeatherIntel(
        region=region_name,
        updated_at=now.isoformat(),
        spray_window=SprayWindow(
            ok=True,
            reason="Low wind and no rain expected for the next 6 hours.",
            best_time="Today, 6:00-9:00 AM",
        ),
        days=days,
    )


def _build_spray_window(days: list[DailyForecast]) -> SprayWindow:
    today = days[0]
    if today.rain_chance_pct >= 60:
        return SprayWindow(
            ok=False,
            reason=f"High rain chance today ({int(today.rain_chance_pct)}%) — treatment would wash off.",
            best_time="Wait for the next dry morning",
        )
    if today.wind_kph > 15:
        return SprayWindow(
            ok=False,
            reason=f"Wind is {int(today.wind_kph)} km/h — spray would drift off-target.",
            best_time="Early morning when wind drops",
        )
    return SprayWindow(
        ok=True,
        reason="Low wind and low rain probability in the coming hours.",
        best_time="Today, 6:00–9:00 AM",
    )


def _geocode(region: str) -> tuple[float, float] | None:
    """Resolve a district name (e.g. 'Dhaka') to coordinates. Returns None on
    any failure so the caller can fall back to env coordinates."""
    try:
        with httpx.Client(timeout=10) as client:
            res = client.get(
                GEOCODE_URL,
                params={"q": f"{region},BD", "limit": 1, "appid": OPENWEATHER_API_KEY},
            )
            res.raise_for_status()
        hits = res.json()
        if hits:
            return float(hits[0]["lat"]), float(hits[0]["lon"])
    except (httpx.HTTPError, KeyError, ValueError, TypeError):
        pass
    return None


def get_weather(user_region: str | None = None) -> WeatherIntel:
    region_name = (user_region or "").strip() or WEATHER_REGION_NAME

    if weather_is_mock():
        return _mock_weather(region_name)

    lat, lon = WEATHER_LAT, WEATHER_LON
    if user_region:
        coords = _geocode(region_name)
        if coords:
            lat, lon = coords

    params = {"lat": lat, "lon": lon, "appid": OPENWEATHER_API_KEY, "units": "metric"}
    with httpx.Client(timeout=20) as client:
        res = client.get(FORECAST_URL, params=params)
        res.raise_for_status()
    payload = res.json()

    buckets: dict[str, list[dict]] = {}
    for entry in payload.get("list", []):
        day_key = entry["dt_txt"][:10]
        buckets.setdefault(day_key, []).append(entry)

    days: list[DailyForecast] = []
    for day_key, entries in sorted(buckets.items())[:5]:
        temps_min = min(e["main"]["temp_min"] for e in entries)
        temps_max = max(e["main"]["temp_max"] for e in entries)
        humidity = sum(e["main"]["humidity"] for e in entries) / len(entries)
        rain_chance = max(e.get("pop", 0) for e in entries) * 100
        wind_kph = max(e["wind"]["speed"] for e in entries) * 3.6
        main = entries[len(entries) // 2]["weather"][0]["main"]
        days.append(
            DailyForecast(
                date=f"{day_key}T12:00:00+00:00",
                temp_min_c=round(temps_min, 1),
                temp_max_c=round(temps_max, 1),
                humidity_pct=round(humidity),
                rain_chance_pct=round(rain_chance),
                wind_kph=round(wind_kph, 1),
                condition=_condition(main),  # type: ignore[arg-type]
            )
        )

    return WeatherIntel(
        region=region_name,
        updated_at=datetime.now(timezone.utc).isoformat(),
        spray_window=_build_spray_window(days),
        days=days,
    )