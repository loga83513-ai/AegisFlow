CONFIDENCE_THRESHOLD = 0.50


def get_confidence_review(category_confidence, priority_confidence):
    category_needs_review = (
        category_confidence is None
        or category_confidence < CONFIDENCE_THRESHOLD
    )

    priority_needs_review = (
        priority_confidence is None
        or priority_confidence < CONFIDENCE_THRESHOLD
    )

    return {
        "category_needs_review": category_needs_review,
        "priority_needs_review": priority_needs_review,
        "needs_human_review": (
            category_needs_review or priority_needs_review
        ),
    }