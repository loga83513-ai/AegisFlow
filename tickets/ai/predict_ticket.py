from tickets.ai.predict_category import predict_category
from tickets.ai.predict_priority import predict_priority
from tickets.ai.troubleshooting import get_troubleshooting_steps


def analyze_ticket(ticket_text):

    # Predict category
    category_result = predict_category(ticket_text)

    # Predict priority
    priority_result = predict_priority(ticket_text)

    # Get troubleshooting recommendations
    suggestions = get_troubleshooting_steps(
        category_result["category"]
    )

    return {
        "predicted_category": category_result["category"],
        "category_confidence": category_result["confidence"],

        "predicted_priority": priority_result["priority"],
        "priority_confidence": priority_result["confidence"],

        "suggested_steps": suggestions
    }