from tickets.ai.predict_ticket import analyze_ticket

ticket = """
WiFi connection problem.
My office laptop is unable to connect
to the company network.
"""

result = analyze_ticket(ticket)

print("AI Ticket Analysis")
print("------------------")

print("Category:", result["predicted_category"])
print("Category Confidence:", result["category_confidence"])

print("Priority:", result["predicted_priority"])
print("Priority Confidence:", result["priority_confidence"])

print("\nSuggested Troubleshooting Steps:")

for index, step in enumerate(result["suggested_steps"], start=1):
    print(f"{index}. {step}")