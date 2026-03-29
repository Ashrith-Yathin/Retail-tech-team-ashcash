from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split


BASE_DIR = Path(__file__).resolve().parent
DATASET_PATH = BASE_DIR / "training_data.csv"
MODEL_PATH = BASE_DIR / "model.pkl"


def main():
    if not DATASET_PATH.exists():
        raise FileNotFoundError(f"Training dataset not found at {DATASET_PATH}")

    data = pd.read_csv(DATASET_PATH)
    feature_columns = [
        "distance",
        "discount",
        "expiry_urgency",
        "popularity",
        "category_relevance",
        "time_of_day",
    ]
    X = data[feature_columns]
    y = data["label"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    logistic_model = LogisticRegression(max_iter=1000)
    logistic_model.fit(X_train, y_train)

    forest_model = RandomForestClassifier(n_estimators=250, max_depth=8, random_state=42)
    forest_model.fit(X_train, y_train)

    logistic_score = logistic_model.score(X_test, y_test)
    forest_score = forest_model.score(X_test, y_test)
    selected_model = forest_model if forest_score >= logistic_score else logistic_model

    predictions = selected_model.predict(X_test)
    print("Selected model:", type(selected_model).__name__)
    print("Accuracy:", round(max(logistic_score, forest_score), 4))
    print(classification_report(y_test, predictions))

    joblib.dump(selected_model, MODEL_PATH)
    print(f"Saved trained model to {MODEL_PATH}")


if __name__ == "__main__":
    main()

