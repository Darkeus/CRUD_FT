from django.db import models
from django.contrib.auth.models import User

class Campain(models.Model):
    name= models.CharField(max_length=100)
    keywords = models.CharField(max_length=500)
    bidAmount = models.DecimalField(max_digits=10, decimal_places=2 )
    founds = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.BooleanField(default=False)
    town = models.CharField(max_length=100)
    radius = models.IntegerField(default=5)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='campaigns')

    def get_keywords_list(self):
        return self.keywords.split(',')

    def __str__(self):
        return self.name

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    emerald_funds = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"{self.user.username}'s Profile"