from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'campains', views.CampainViewSet, basename='campains')

urlpatterns = [
    path("", include(router.urls)),
    path("user-data/", views.get_user_data, name="user-data"),
    path("add-funds/", views.add_funds, name="add-funds"),
    path("subtract-funds/", views.subtract_funds, name="subtract-funds"),  # Nowy endpoint
]