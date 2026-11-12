import pickle
from pathlib import Path

MODEL_PATH = Path(__file__).resolve().parent / "category_model.pkl"

with open(MODEL_PATH, "rb") as file:
    model = pickle.load(file)

test_tickets = [
    "WiFi is not connecting",
    "Unable to send emails",
    "Laptop is not turning on",
    "Application is crashing",
    "Unable to login to my account",
    "I need access to a shared folder",
]

for ticket in test_tickets:
    prediction = model.predict([ticket])[0]
    probabilities = model.predict_proba([ticket])[0]
    confidence = max(probabilities) * 100

    print(f"\nTicket: {ticket}")
    print(f"Predicted category: {prediction}")
    print(f"Model confidence: {confidence:.2f}%")