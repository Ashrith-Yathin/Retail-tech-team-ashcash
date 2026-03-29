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


def parse_tags(tags: str | list[str] | None) -> list[str]:
    if tags is None:
        return []
    if isinstance(tags, list):
        return [tag.strip() for tag in tags if tag.strip()]
    return [tag.strip() for tag in tags.split(",") if tag.strip()]


def serialize_tags(tags: str | list[str] | None) -> str | None:
    parsed = parse_tags(tags)
    return ", ".join(parsed) if parsed else None


def savings_amount(original_price: float, final_price: float) -> float:
    return round(max(original_price - final_price, 0), 2)


def urgency_label(expiry_time: datetime) -> str:
    hours_remaining = max((ensure_utc(expiry_time) - datetime.now(timezone.utc)).total_seconds() / 3600, 0)
    if hours_remaining <= 2:
        return "Expiring very soon"
    if hours_remaining <= 8:
        return "Expiring today"
    if hours_remaining <= 24:
        return "Limited time"
    return "Freshly listed"


def popularity_label(views: int, clicks: int) -> str:
    rate = conversion_rate(views, clicks)
    if clicks >= 20 or rate >= 40:
        return "Trending now"
    if clicks >= 8 or rate >= 20:
        return "Popular"
    return "New discovery"


def availability_label(quantity: int) -> str:
    if quantity <= 3:
        return "Almost gone"
    if quantity <= 10:
        return "Limited stock"
    return "In stock"


def waste_prevented_kg(quantity: int) -> float:
    return round(quantity * 0.35, 2)


def ranking_reasons(
    *,
    discount: float,
    distance_km: float,
    expiry_time: datetime,
    views: int,
    clicks: int,
) -> list[str]:
    reasons: list[str] = []
    if discount >= 40:
        reasons.append("High discount")
    elif discount >= 25:
        reasons.append("Strong savings")

    if distance_km <= 1:
        reasons.append("Very close to you")
    elif distance_km <= 3:
        reasons.append("Nearby pickup")

    label = urgency_label(expiry_time)
    if label in {"Expiring very soon", "Expiring today"}:
        reasons.append(label)

    pop_label = popularity_label(views, clicks)
    if pop_label != "New discovery":
        reasons.append(pop_label)

    return reasons[:4] or ["Smart-ranked for relevance"]
