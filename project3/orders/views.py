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
    numOfToppings = NumOfToppings.objects.all()
    pizzaSizes = PizzaSize.objects.all()
    pizzaPrices = Pizza.objects.all()
    doughsData = serializers.serialize("json", doughs)
    toppingsData = serializers.serialize("json", toppings)
    numOfToppingsData = serializers.serialize("json", numOfToppings)
    pizzaSizesData = serializers.serialize("json", pizzaSizes)
    pizzaPricesData = serializers.serialize("json", pizzaPrices)
    jsonObject = {"doughs": doughsData, "toppings": toppingsData, "numOfToppings": numOfToppingsData, "pizzaSizes": pizzaSizesData, "pizzaPrices": pizzaPricesData}
    return JsonResponse(jsonObject)

def salads(request):
    salads = Salad.objects.all()
    saladsData = serializers.serialize('json', salads)
    jsonObject = {'salads': saladsData}
    return JsonResponse(jsonObject)

def pastas(request):
    pastas = Pasta.objects.all()
    pastasData = serializers.serialize('json', pastas)
    jsonObject = {'pastas': pastasData}
    return JsonResponse(jsonObject)