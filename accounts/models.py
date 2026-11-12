from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = [
        ('EMPLOYEE', 'Employee'),
        ('AGENT', 'Support Agent'),
        ('TEAM_LEAD', 'Team Lead'),
        ('MANAGER', 'Manager'),
        ('ADMIN', 'Admin'),
    ]

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='EMPLOYEE'
    )


from django.db import models

# Create your models here.
