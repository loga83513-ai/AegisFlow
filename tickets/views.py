from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Ticket
from .serializers import TicketSerializer
from rest_framework.permissions import IsAuthenticated
from .permissions import IsSupportStaff, IsAssignedAgentOrManager
from .serializers import TicketStatusUpdateSerializer
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth import get_user_model
from .ai.predict_category import predict_category
from .ai.predict_ticket import analyze_ticket
from .serializers import TicketAIReviewSerializer
from django.shortcuts import get_object_or_404
from .models import TicketComment
from .serializers import TicketCommentSerializer
from .models import TicketStatusHistory
from .serializers import TicketStatusHistorySerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count, Q
from django.db.models.functions import TruncMonth
from .models import Notification
from .serializers import NotificationSerializer

User = get_user_model()

def assign_ticket(ticket):

    agents = User.objects.filter(
        role='AGENT',
        is_active=True
    ).annotate(
        workload=Count(
            'assigned_tickets',
            filter=Q(
                assigned_tickets__status__in=[
                    'OPEN',
                    'IN_PROGRESS'
                ]
            )
        )
    ).order_by('workload', 'id')

    agent = agents.first()

    if agent:
        ticket.assigned_to = agent
        ticket.save(update_fields=['assigned_to'])

        # Notify assigned agent
        Notification.objects.create(
            recipient=agent,
            ticket=ticket,
            title='New Ticket Assigned',
            message=f'You have been assigned ticket #{ticket.id}: {ticket.title}'
        )

        # Notify employee
        Notification.objects.create(
            recipient=ticket.created_by,
            ticket=ticket,
            title='Ticket Assigned',
            message=f'Your ticket #{ticket.id} has been assigned to an agent.'
        )

    return agent

def check_sla_breach(ticket):
    current_time = timezone.now()

    update_fields = []

    # Check Response SLA
    if (
        ticket.response_deadline
        and not ticket.response_sla_breached
    ):
        if (
            ticket.first_responded_at is None
            and current_time > ticket.response_deadline
        ) or (
            ticket.first_responded_at is not None
            and ticket.first_responded_at > ticket.response_deadline
        ):
            ticket.response_sla_breached = True
            update_fields.append('response_sla_breached')

    # Check Resolution SLA using status history
    if (
        ticket.resolution_deadline
        and not ticket.resolution_sla_breached
    ):
        resolved_history = TicketStatusHistory.objects.filter(
            ticket=ticket,
            new_status__in=['RESOLVED', 'CLOSED']
        ).order_by('changed_at').first()

        if resolved_history:
            if resolved_history.changed_at > ticket.resolution_deadline:
                ticket.resolution_sla_breached = True
                update_fields.append('resolution_sla_breached')

        elif (
            ticket.status not in ['RESOLVED', 'CLOSED']
            and current_time > ticket.resolution_deadline
        ):
            ticket.resolution_sla_breached = True
            update_fields.append('resolution_sla_breached')

    if update_fields:
        ticket.save(update_fields=update_fields)

class TicketListCreateAPIView(generics.ListCreateAPIView):

    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == 'EMPLOYEE':
            return Ticket.objects.filter(created_by=user)

        if user.role == 'AGENT':
            return Ticket.objects.filter(assigned_to=user)

        if user.role in ['TEAM_LEAD', 'MANAGER', 'ADMIN']:
            return Ticket.objects.all()

        return Ticket.objects.none()

    def perform_create(self, serializer):
        sla_timings = {
            'LOW': {
                'response': timedelta(hours=24),
                'resolution': timedelta(hours=72),
            },
            'MEDIUM': {
                'response': timedelta(hours=8),
                'resolution': timedelta(hours=24),
            },
            'HIGH': {
                'response': timedelta(hours=2),
                'resolution': timedelta(hours=8),
            },
            'CRITICAL': {
                'response': timedelta(minutes=30),
                'resolution': timedelta(hours=4),
            },
        }

        current_time = timezone.now()

        # Keep employee-selected priority for now
        priority = serializer.validated_data.get('priority', 'MEDIUM')

        response_deadline = (
                current_time + sla_timings[priority]['response']
        )

        resolution_deadline = (
                current_time + sla_timings[priority]['resolution']
        )

        title = serializer.validated_data['title']
        description = serializer.validated_data['description']

        ticket_text = f"{title} {description}"

        # Complete AI analysis
        ai_result = analyze_ticket(ticket_text)

        ticket = serializer.save(
            created_by=self.request.user,
            response_deadline=response_deadline,
            resolution_deadline=resolution_deadline,
            ai_predicted_category=ai_result['predicted_category'],
            ai_predicted_priority=ai_result['predicted_priority'],
            ai_confidence=ai_result['category_confidence'],
            ai_priority_confidence=ai_result['priority_confidence'],
            ai_suggested_steps=ai_result['suggested_steps'],
        )

        assign_ticket(ticket)
class TicketDetailAPIView(generics.RetrieveAPIView):

    serializer_class = TicketSerializer
    permission_classes = [
        IsAuthenticated,
        IsAssignedAgentOrManager
    ]

    def get_queryset(self):
        user = self.request.user

        if user.role == 'EMPLOYEE':
            return Ticket.objects.filter(created_by=user)

        if user.role == 'AGENT':
            return Ticket.objects.filter(assigned_to=user)

        if user.role in ['TEAM_LEAD', 'MANAGER', 'ADMIN']:
            return Ticket.objects.all()

        return Ticket.objects.none()
class TicketStatusUpdateAPIView(generics.UpdateAPIView):

    queryset = Ticket.objects.all()

    serializer_class = TicketStatusUpdateSerializer

    permission_classes = [
        IsAuthenticated,
        IsSupportStaff,
        IsAssignedAgentOrManager
    ]

    def get_queryset(self):
        user = self.request.user

        if user.role == 'AGENT':
            return Ticket.objects.filter(assigned_to=user)

        if user.role in ['TEAM_LEAD', 'MANAGER', 'ADMIN']:
            return Ticket.objects.all()

        return Ticket.objects.none()

    def perform_update(self, serializer):
        ticket = self.get_object()

        old_status = ticket.status
        new_status = serializer.validated_data.get('status', old_status)

        if old_status == new_status:
            return

        update_fields = {}

        if (
                old_status == 'OPEN'
                and new_status == 'IN_PROGRESS'
                and ticket.first_responded_at is None
        ):
            update_fields['first_responded_at'] = timezone.now()

        updated_ticket = serializer.save(**update_fields)

        TicketStatusHistory.objects.create(
            ticket=updated_ticket,
            old_status=old_status,
            new_status=new_status,
            changed_by=self.request.user
        )
        Notification.objects.create(
            recipient=updated_ticket.created_by,
            ticket=updated_ticket,
            title='Ticket Status Updated',
            message=(
                f'Your ticket #{updated_ticket.id} status '
                f'changed from {old_status} to {new_status}.'
            )
        )
class TicketAIReviewAPIView(generics.UpdateAPIView):

    serializer_class = TicketAIReviewSerializer

    permission_classes = [
        IsAuthenticated,
        IsSupportStaff,
        IsAssignedAgentOrManager
    ]

    def get_queryset(self):
        user = self.request.user

        if user.role == 'AGENT':
            return Ticket.objects.filter(assigned_to=user)

        if user.role in ['TEAM_LEAD', 'MANAGER', 'ADMIN']:
            return Ticket.objects.all()

        return Ticket.objects.none()

    def perform_update(self, serializer):
        ticket = self.get_object()

        old_priority = ticket.priority
        new_priority = serializer.validated_data.get(
            'priority',
            old_priority
        )

        sla_timings = {
            'LOW': {
                'response': timedelta(hours=24),
                'resolution': timedelta(hours=72),
            },
            'MEDIUM': {
                'response': timedelta(hours=8),
                'resolution': timedelta(hours=24),
            },
            'HIGH': {
                'response': timedelta(hours=2),
                'resolution': timedelta(hours=8),
            },
            'CRITICAL': {
                'response': timedelta(minutes=30),
                'resolution': timedelta(hours=4),
            },
        }

        update_fields = {}

        # Recalculate SLA only when priority changes
        if new_priority != old_priority:
            current_time = timezone.now()

            update_fields['response_deadline'] = (
                current_time + sla_timings[new_priority]['response']
            )

            update_fields['resolution_deadline'] = (
                current_time + sla_timings[new_priority]['resolution']
            )

            # Recheck breach status against new deadlines
            update_fields['response_sla_breached'] = False
            update_fields['resolution_sla_breached'] = False

        serializer.save(**update_fields)
class TicketCommentListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = TicketCommentSerializer
    permission_classes = [IsAuthenticated]

    def get_ticket(self):
        user = self.request.user

        tickets = Ticket.objects.all()

        if user.role == 'EMPLOYEE':
            tickets = tickets.filter(created_by=user)

        elif user.role == 'AGENT':
            tickets = tickets.filter(assigned_to=user)

        elif user.role not in ['TEAM_LEAD', 'MANAGER', 'ADMIN']:
            tickets = tickets.none()

        return get_object_or_404(
            tickets,
            pk=self.kwargs['pk']
        )

    def get_queryset(self):
        ticket = self.get_ticket()

        return TicketComment.objects.filter(
            ticket=ticket
        ).select_related('author').order_by('created_at')

    def perform_create(self, serializer):
        ticket = self.get_ticket()

        comment = serializer.save(
            ticket=ticket,
            author=self.request.user
        )

        if self.request.user != ticket.created_by:
            Notification.objects.create(
                recipient=ticket.created_by,
                ticket=ticket,
                title='New Comment on Your Ticket',
                message=(
                    f'{self.request.user.username} commented '
                    f'on your ticket #{ticket.id}: {comment.message}'
                )
            )
class TicketStatusHistoryAPIView(generics.ListAPIView):

    serializer_class = TicketStatusHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        ticket_id = self.kwargs['pk']

        tickets = Ticket.objects.all()

        if user.role == 'EMPLOYEE':
            tickets = tickets.filter(created_by=user)

        elif user.role == 'AGENT':
            tickets = tickets.filter(assigned_to=user)

        elif user.role not in ['TEAM_LEAD', 'MANAGER', 'ADMIN']:
            tickets = tickets.none()

        ticket = get_object_or_404(tickets, pk=ticket_id)

        return TicketStatusHistory.objects.filter(
            ticket=ticket
        ).select_related('changed_by')

class DashboardAnalyticsAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user

        # Apply role-based ticket access
        if user.role == 'EMPLOYEE':
            tickets = Ticket.objects.filter(created_by=user)

        elif user.role == 'AGENT':
            tickets = Ticket.objects.filter(assigned_to=user)

        elif user.role in ['TEAM_LEAD', 'MANAGER', 'ADMIN']:
            tickets = Ticket.objects.all()

        else:
            tickets = Ticket.objects.none()

        # Calculate dashboard statistics
        analytics = tickets.aggregate(
            total_tickets=Count('id'),

            open_tickets=Count(
                'id',
                filter=Q(status='OPEN')
            ),

            in_progress_tickets=Count(
                'id',
                filter=Q(status='IN_PROGRESS')
            ),

            resolved_tickets=Count(
                'id',
                filter=Q(status='RESOLVED')
            ),

            critical_tickets=Count(
                'id',
                filter=Q(priority='CRITICAL')
            ),
            response_sla_breached_tickets=Count(
                'id',
                filter=Q(response_sla_breached=True)
            ),
            resolution_sla_breached_tickets=Count(
                'id',
                filter=Q(resolution_sla_breached=True)
            ),

            sla_breached_tickets=Count(
                'id',
                filter=(
                    Q(response_sla_breached=True)
                    | Q(resolution_sla_breached=True)
                )
            )
        )

        return Response(analytics)
class PublicHomepageStatsAPIView(APIView):

    permission_classes = []

    authentication_classes = []

    def get(self, request):

        User = get_user_model()

        stats = {
            'total_tickets': Ticket.objects.count(),

            'resolved_tickets': Ticket.objects.filter(
                status='RESOLVED'
            ).count(),

            'active_users': User.objects.filter(
                is_active=True
            ).count(),

            'critical_tickets': Ticket.objects.filter(
                priority='CRITICAL'
            ).count(),
        }

        return Response(stats)
class MonthlyTicketAnalyticsAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user

        # Role-based ticket filtering
        if user.role == 'EMPLOYEE':
            tickets = Ticket.objects.filter(created_by=user)

        elif user.role == 'AGENT':
            tickets = Ticket.objects.filter(assigned_to=user)

        elif user.role in ['TEAM_LEAD', 'MANAGER', 'ADMIN']:
            tickets = Ticket.objects.all()

        else:
            tickets = Ticket.objects.none()

        current_year = timezone.now().year

        # Monthly created tickets
        created_data = (
            tickets.filter(created_at__year=current_year)
            .annotate(month=TruncMonth('created_at'))
            .values('month')
            .annotate(count=Count('id'))
            .order_by('month')
        )

        # Monthly resolved tickets
        resolved_data = (
            TicketStatusHistory.objects.filter(
                ticket__in=tickets,
                new_status='RESOLVED',
                changed_at__year=current_year
            )
            .annotate(month=TruncMonth('changed_at'))
            .values('month')
            .annotate(count=Count('id'))
            .order_by('month')
        )

        # Prepare response for all 12 months
        monthly_stats = []

        for month in range(1, 13):

            created_count = next(
                (
                    item['count']
                    for item in created_data
                    if item['month'].month == month
                ),
                0
            )

            resolved_count = next(
                (
                    item['count']
                    for item in resolved_data
                    if item['month'].month == month
                ),
                0
            )

            monthly_stats.append({
                'month': month,
                'created': created_count,
                'resolved': resolved_count
            })

        return Response(monthly_stats)
class NotificationListAPIView(generics.ListAPIView):

    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(
            recipient=self.request.user
        ).select_related(
            'ticket'
        ).order_by('-created_at')
class NotificationMarkReadAPIView(generics.UpdateAPIView):

    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(
            recipient=self.request.user
        )

    def perform_update(self, serializer):
        serializer.save(is_read=True)
