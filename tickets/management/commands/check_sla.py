from django.core.management.base import BaseCommand
from tickets.models import Ticket
from tickets.views import check_sla_breach


class Command(BaseCommand):
    help = 'Check and update SLA breach status for tickets'

    def handle(self, *args, **options):
        tickets = Ticket.objects.exclude(
            status__in=['RESOLVED', 'CLOSED']
        )

        checked_count = 0

        for ticket in tickets:
            check_sla_breach(ticket)
            checked_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f'SLA check completed. {checked_count} tickets checked.'
            )
        )