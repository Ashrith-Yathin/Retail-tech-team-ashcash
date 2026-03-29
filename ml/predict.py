from datetime import datetime
from pathlib import Path
import json
import sys

import joblib


BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "model.pkl"


def rule_based_score(payload: dict) -> float:
    return round(
        (0.4 * payload["discount"])
        + (0.3 * payload["expiry_urgency"])
        + (0.2 * payload["distance_score"])
        + (0.1 * payload["popularity"]),
        2,
    )


def main():
    if len(sys.argv) != 2:
        raise SystemExit("Usage: python predict.py '<json-payload>'")

    payload = json.loads(sys.argv[1])
    features = [[
        payload["distance"],
        payload["discount"],
        payload["expiry_urgency"],
        payload["popularity"],
        payload["category_relevance"],
        payload.get("time_of_day", datetime.now().hour),
    ]]

    if MODEL_PATH.exists():
        model = joblib.load(MODEL_PATH)
        score = round(float(model.predict_proba(features)[0][1] * 100), 2)
    else:
        score = rule_based_score(payload)

    print(json.dumps({"score": score}))


if __name__ == "__main__":
    main()
