from django.http import HttpResponse
from django.http import JsonResponse
from django.shortcuts import render
from .models import *
from django.core import serializers

# Create your views here.
def index(request):
    return render(request, "orders/index.html")

def pizzas(request):
    doughs = Dough.objects.all()
    toppings = Topping.objects.all()
    pizzaSizes = PizzaSize.objects.all()
    pizzaPrices = Pizza.objects.all()
    doughsData = serializers.serialize("json", doughs)
    toppingsData = serializers.serialize("json", toppings)
    pizzaSizesData = serializers.serialize("json", pizzaSizes)
    pizzaPricesData = serializers.serialize("json", pizzaPrices)
    jsonObject = {"doughs": doughsData, "toppings": toppingsData, "pizzaSizes": pizzaSizesData, "pizzaPrices": pizzaPricesData}
    return JsonResponse(jsonObject)
