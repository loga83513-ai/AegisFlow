import pickle
from pathlib import Path

MODEL_PATH = Path(__file__).resolve().parent / "priority_model.pkl"

with open(MODEL_PATH, "rb") as file:
    model = pickle.load(file)


def predict_priority(ticket_text):
    probabilities = model.predict_proba([ticket_text])[0]

    predicted_index = probabilities.argmax()
    priority = model.classes_[predicted_index]
    confidence = float(probabilities[predicted_index])

    return {
        "priority": priority,
        "confidence": round(confidence, 4)
    }