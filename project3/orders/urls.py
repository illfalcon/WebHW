from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("pizzas", views.pizzas, name="pizzas"),
    path("salads", views.salads, name="salads"),
    path("pastas", views.pastas, name="pastas"),
    path("subs", views.subs, name="subs"),
    path("platters", views.platters, name="platters"),
    path("order", views.order, name="order")
]
