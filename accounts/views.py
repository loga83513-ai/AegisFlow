from rest_framework import generics, status
from rest_framework.response import Response

from .serializers import RegisterSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import LoginSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied

from .serializers import TeamMemberSerializer
from .models import User
from .serializers import ProfileSerializer
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.shortcuts import get_object_or_404
class RegisterAPIView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            return Response(
                {
                    "message": "User registered successfully",
                    "username": user.username,
                    "email": user.email,
                    "role": user.role
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class LoginAPIView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data['user']

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "Login successful",
                "username": user.username,
                "role": user.role,
                "refresh": str(refresh),
                "access": str(refresh.access_token)
            },
            status=status.HTTP_200_OK
        )
class TeamAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        print("Logged-in username:", request.user.username)
        print("Logged-in role:", request.user.role)

        allowed_roles = ['TEAM_LEAD', 'MANAGER', 'ADMIN']

        if request.user.role not in allowed_roles:
            raise PermissionDenied(
                "You do not have permission to view team members."
            )

        users = User.objects.all().order_by('-date_joined')

        serializer = TeamMemberSerializer(users, many=True)

        return Response({
            "total_members": users.count(),
            "members": serializer.data
        })
class UserRoleUpdateAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def patch(self, request, user_id):

        # Only ADMIN can change user roles
        if request.user.role != 'ADMIN':
            raise PermissionDenied(
                "Only admins can update user roles."
            )

        # Find the target user
        user = get_object_or_404(User, id=user_id)

        # Prevent changing your own role
        if user.id == request.user.id:
            return Response(
                {"error": "You cannot change your own role."},
                status=status.HTTP_400_BAD_REQUEST
            )

        new_role = request.data.get('role')

        # Validate role
        allowed_roles = [
            role[0] for role in User.ROLE_CHOICES
        ]

        if new_role not in allowed_roles:
            return Response(
                {"error": "Invalid role."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Protect existing admin accounts
        if user.role == 'ADMIN' and new_role != 'ADMIN':
            return Response(
                {"error": "You cannot demote an admin account."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.role = new_role
        user.save(update_fields=['role'])

        return Response({
            "message": "User role updated successfully.",
            "username": user.username,
            "role": user.role
        })
class ProfileAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = ProfileSerializer(request.user)

        return Response(serializer.data)

    def patch(self, request):
        serializer = ProfileSerializer(
            request.user,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()

            return Response({
                "message": "Profile updated successfully",
                "profile": serializer.data
            })

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
class ChangePasswordAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')

        if not current_password or not new_password:
            return Response(
                {"error": "Both passwords are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = request.user

        if not user.check_password(current_password):
            return Response(
                {"error": "Current password is incorrect."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            validate_password(new_password, user)
        except ValidationError as errors:
            return Response(
                {"error": errors.messages},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()

        return Response({
            "message": "Password changed successfully."
        })


