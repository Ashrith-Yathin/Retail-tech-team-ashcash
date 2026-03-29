from datetime import datetime
from pathlib import Path

try:
    import joblib
except ImportError:  # pragma: no cover - optional in lightweight deploys
    joblib = None

from app.config import get_settings
from app.utils import distance_score, expiry_urgency


settings = get_settings()


def _model_path() -> Path:
    return (Path(__file__).resolve().parent / settings.model_path).resolve()


def build_feature_row(
    *,
    distance_km: float,
    discount: float,
    expiry_time: datetime,
    popularity: float,
    category: str,
    preferred_category: str | None,
    time_of_day: int,
) -> dict:
    category_relevance = 1 if preferred_category and category.lower() == preferred_category.lower() else 0
    return {
        "distance": round(distance_km, 4),
        "discount": discount,
        "expiry_urgency": expiry_urgency(expiry_time),
        "popularity": popularity,
        "category_relevance": category_relevance,
        "time_of_day": time_of_day,
        "distance_score": distance_score(distance_km),
    }


def rule_based_score(feature_row: dict) -> float:
    return round(
        (0.4 * feature_row["discount"])
        + (0.3 * feature_row["expiry_urgency"])
        + (0.2 * feature_row["distance_score"])
        + (0.1 * feature_row["popularity"]),
        2,
    )


def rank_feature_rows(feature_rows: list[dict]) -> list[float]:
    model_file = _model_path()
    if model_file.exists() and joblib is not None:
        model = joblib.load(model_file)
        ordered_features = [
            [
                row["distance"],
                row["discount"],
                row["expiry_urgency"],
                row["popularity"],
                row["category_relevance"],
                row["time_of_day"],
            ]
            for row in feature_rows
        ]
        predictions = model.predict_proba(ordered_features)[:, 1]
        return [round(float(pred * 100), 2) for pred in predictions]
    return [rule_based_score(row) for row in feature_rows]
