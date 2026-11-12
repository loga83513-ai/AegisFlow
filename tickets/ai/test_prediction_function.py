from tickets.ai.predict_category import predict_category

test_tickets = [
    "My internet connection is not working",
    "I cannot send emails to customers",
    "My laptop battery is not charging",
    "The application keeps crashing",
    "My password is not accepted",
    "I need permission to access company files",
]

for ticket in test_tickets:
    result = predict_category(ticket)

    print("\nTicket:", ticket)
    print("Predicted category:", result["category"])
    print("Confidence:", result["confidence"])