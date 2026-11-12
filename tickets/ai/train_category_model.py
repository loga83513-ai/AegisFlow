import pickle
from pathlib import Path

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

from .training_data import CATEGORY_TRAINING_DATA


# Separate ticket text and category labels
texts = [ticket[0] for ticket in CATEGORY_TRAINING_DATA]
labels = [ticket[1] for ticket in CATEGORY_TRAINING_DATA]


# Create AI pipeline
model = Pipeline([
    ("tfidf", TfidfVectorizer()),
    ("classifier", LogisticRegression(max_iter=1000))
])


# Train the model
model.fit(texts, labels)


# Save the trained model
MODEL_PATH = Path(__file__).resolve().parent / "category_model.pkl"

with open(MODEL_PATH, "wb") as file:
    pickle.dump(model, file)


print("Category model trained successfully!")
print(f"Model saved at: {MODEL_PATH}")