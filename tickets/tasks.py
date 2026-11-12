from celery import shared_task
from .models import Ticket
from .views import check_sla_breach


@shared_task
def check_sla_tickets():
    tickets = Ticket.objects.all()

    checked_count = 0

    for ticket in tickets:
        check_sla_breach(ticket)
        checked_count += 1

    return checked_count