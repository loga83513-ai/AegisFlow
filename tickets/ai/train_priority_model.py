import pickle
from pathlib import Path

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

from .priority_training_data import PRIORITY_TRAINING_DATA


# Separate ticket descriptions and priority labels
texts = [ticket[0] for ticket in PRIORITY_TRAINING_DATA]
labels = [ticket[1] for ticket in PRIORITY_TRAINING_DATA]


# Create AI pipeline
model = Pipeline([
    ("tfidf", TfidfVectorizer()),
    ("classifier", LogisticRegression(max_iter=1000))
])


# Train priority model
model.fit(texts, labels)


# Save trained model
MODEL_PATH = Path(__file__).resolve().parent / "priority_model.pkl"

with open(MODEL_PATH, "wb") as file:
    pickle.dump(model, file)


print("Priority model trained successfully!")
print(f"Model saved at: {MODEL_PATH}")