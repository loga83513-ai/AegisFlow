from rest_framework import serializers

from .ai.confidence_review import get_confidence_review
from .models import Ticket, TicketComment, TicketStatusHistory, Notification


assigned_to_username = serializers.CharField(
    source='assigned_to.username',
    read_only=True,
    allow_null=True
)
class TicketSerializer(serializers.ModelSerializer):

    assigned_to_username = serializers.CharField(
        source='assigned_to.username',
        read_only=True,
        allow_null=True
    )

    def to_representation(self, instance):
        data = super().to_representation(instance)

        review_result = get_confidence_review(
            instance.ai_confidence,
            instance.ai_priority_confidence
        )

        data.update(review_result)

        return data

    class Meta:
        model = Ticket

        fields = [
            'id',
            'title',
            'description',
            'status',
            'priority',
            'created_by',
            'assigned_to',
            'assigned_to_username',
            'created_at',
            'updated_at',
            'response_deadline',
            'resolution_deadline',
            'first_responded_at',
            'category',
            'ai_predicted_category',
            'ai_confidence',
            'ai_predicted_priority',
            'ai_suggested_steps',
            'ai_priority_confidence',
            'response_sla_breached',
            'resolution_sla_breached',
        ]

        read_only_fields = [
            'id',
            'status',
            'created_by',
            'assigned_to',
            'created_at',
            'updated_at',
            'response_deadline',
            'resolution_deadline',
            'first_responded_at',

            'ai_predicted_category',
            'ai_confidence',
            'ai_predicted_priority',
            'ai_suggested_steps',
            'ai_priority_confidence',
            'response_sla_breached',
            'resolution_sla_breached',
        ]
class TicketStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = [
            'status',
        ]
class TicketAIReviewSerializer(serializers.ModelSerializer):

    class Meta:
        model = Ticket
        fields = [
            'category',
            'priority',
        ]
class TicketCommentSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(
        source='author.username',
        read_only=True
    )

    class Meta:
        model = TicketComment
        fields = [
            'id',
            'ticket',
            'author',
            'author_username',
            'message',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'ticket',
            'author',
            'author_username',
            'created_at',
            'updated_at',
        ]
class TicketStatusHistorySerializer(serializers.ModelSerializer):

    changed_by_username = serializers.CharField(
        source='changed_by.username',
        read_only=True
    )

    class Meta:
        model = TicketStatusHistory

        fields = [
            'id',
            'ticket',
            'old_status',
            'new_status',
            'changed_by',
            'changed_by_username',
            'changed_at',
        ]

        read_only_fields = fields
class NotificationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Notification

        fields = [
            'id',
            'ticket',
            'title',
            'message',
            'is_read',
            'created_at',
        ]

        read_only_fields = fields