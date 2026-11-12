from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    RegisterAPIView,
    LoginAPIView,
    TeamAPIView,
    ProfileAPIView,
    ChangePasswordAPIView,
    UserRoleUpdateAPIView,
)
urlpatterns = [
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('team/', TeamAPIView.as_view(), name='team'),
    path('profile/', ProfileAPIView.as_view(), name='profile'),
    path('change-password/', ChangePasswordAPIView.as_view(), name='change_password'),
    path(
        'users/<int:user_id>/role/',
        UserRoleUpdateAPIView.as_view(),
        name='update_user_role'
    ),
]