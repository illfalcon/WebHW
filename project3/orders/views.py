from django.http import HttpResponse
from django.http import JsonResponse
from django.shortcuts import render
from .models import *
from django.core import serializers
import json

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

def subs(request):
    subs = Sub.objects.all()
    fillings = SubFilling.objects.all()
    sizes = SubSize.objects.all()
    extras = Extra.objects.all()
    subsData = serializers.serialize('json', subs)
    fillingsData = serializers.serialize('json', fillings)
    sizesData = serializers.serialize('json', sizes)
    extrasData = serializers.serialize('json', extras)
    jsonObject = {'fillings': fillingsData, 'sizes': sizesData, 'subs': subsData, 'extras': extrasData}
    return JsonResponse(jsonObject)

def platters(request):
    sizes = PlatterSize.objects.all()
    names = PlatterName.objects.all()
    platters = DinnerPlatter.objects.all()
    sizesData = serializers.serialize('json', sizes)
    namesData = serializers.serialize('json', names)
    plattersData = serializers.serialize('json', platters)
    jsonObject = {'sizes': sizesData, 'names': namesData, 'platters': plattersData}
    return JsonResponse(jsonObject)

def order(request):
    order = request.POST['cart']
    orderObj = json.loads(order)
    textOrder = 'Pizzas: \n'
    for pizza in orderObj['pizzas']:
        textOrder += f'{pizza["size"]} {pizza["dough"]} pizza with'
        for topping in pizza["toppings"]:
            textOrder += f'{topping} '
        textOrder += '\n'
    textOrder += 'Pastas: \n'
    for pasta in orderObj['pastas']:
        textOrder += f'{pasta["pasta"]}\n'
    textOrder += 'Salads: \n'
    for salad in orderObj['salads']:
        textOrder += f'{salad["salad"]}\n'
    textOrder += 'Subs: \n'
    for sub in orderObj["subs"]:
        textOrder += f'{sub["size"]} {sub["sub"]} sub with'
        for extra in sub["extras"]:
            textOrder += f'{extra} '
        textOrder += '\n'
    textOrder += 'Platters: \n'
    for platter in orderObj["platters"]:
        textOrder += f'{platter["size"]} {platter["platter"]} platter \n'
    orderModel = Order(text=textOrder, total=orderObj['total'])
    orderModel.save()
    return JsonResponse({'success': True})

