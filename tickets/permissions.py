from rest_framework.permissions import BasePermission


class IsSupportStaff(BasePermission):
    message = "Only support staff can update ticket status."

    def has_permission(self, request, view):
        allowed_roles = ['AGENT', 'TEAM_LEAD', 'MANAGER', 'ADMIN']

        return (
            request.user.is_authenticated
            and request.user.role in allowed_roles
        )


class IsAssignedAgentOrManager(BasePermission):
    message = "You are not authorized to access this ticket."

    def has_object_permission(self, request, view, obj):
        user = request.user

        if user.role in ['TEAM_LEAD', 'MANAGER', 'ADMIN']:
            return True

        if user.role == 'AGENT':
            return obj.assigned_to_id == user.id

        if user.role == 'EMPLOYEE':
            return obj.created_by_id == user.id

        return False