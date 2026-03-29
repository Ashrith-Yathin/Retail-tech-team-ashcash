from datetime import datetime, timezone
from math import atan2, cos, radians, sin, sqrt


def calculate_final_price(original_price: float, discount: float) -> float:
    return round(original_price * (1 - discount / 100), 2)


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    earth_radius_km = 6371
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return earth_radius_km * c


def expiry_urgency(expiry_time: datetime) -> float:
    now = datetime.now(timezone.utc)
    hours_remaining = max((expiry_time - now).total_seconds() / 3600, 0)
    return max(0, min(100, 100 - hours_remaining * 4))


def distance_score(distance_km: float, max_radius_km: float = 5) -> float:
    if distance_km > max_radius_km:
        return 0
    return max(0, (1 - distance_km / max_radius_km) * 100)


def conversion_rate(views: int, clicks: int) -> float:
    if views == 0:
        return 0
    return round((clicks / views) * 100, 2)


def ensure_utc(dt: datetime) -> datetime:
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)
