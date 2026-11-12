from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


class CustomUserAdmin(UserAdmin):

    fieldsets = UserAdmin.fieldsets + (
        ('AegisFlow Details', {'fields': ('role',)}),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        ('AegisFlow Details', {'fields': ('role',)}),
    )


admin.site.register(User, CustomUserAdmin)