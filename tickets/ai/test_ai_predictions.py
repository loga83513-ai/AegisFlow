from tickets.ai.predict_category import predict_category
from tickets.ai.predict_priority import predict_priority

test_tickets = [
    "Minor issue with desktop wallpaper settings",
    "Email synchronization is not working",
    "Department network connection is unavailable",
    "Company-wide network outage affecting all employees",
    "Production database is completely unavailable",

]

for ticket in test_tickets:
    category_result = predict_category(ticket)
    priority_result = predict_priority(ticket)

    print("\nTicket:", ticket)

    print(
        "Predicted category:",
        category_result["category"]
    )
    print(
        "Category confidence:",
        category_result["confidence"] * 100,
        "%"
    )

    print(
        "Predicted priority:",
        priority_result["priority"]
    )
    print(
        "Priority confidence:",
        priority_result["confidence"] * 100,
        "%"
    )