from django.db import models


# pizza models

class Dough(models.Model):
    name = models.CharField(max_length=64)
    def __str__(self):
        return f"{self.name}"


class Topping(models.Model):
    name = models.CharField(max_length=64)
    def __str__(self):
        return f"{self.name}"


class PizzaSize(models.Model):
    name = models.CharField(max_length=64)
    def __str__(self):
        return f"{self.name}"


class Pizza(models.Model):
    dough = models.ForeignKey('Dough', on_delete=models.CASCADE)
    size = models.ForeignKey('PizzaSize', on_delete=models.CASCADE)

    TOPPINGS_CHOICES = (
        ('Cheese', 'Cheese'),
        ('1 topping', '1 topping'),
        ('2 toppings', '2 toppings'),
        ('3 toppings', '3 toppings'),
        ('Special', 'Special')
    )
    numOfToppings = models.CharField(max_length=64, choices=TOPPINGS_CHOICES)
    price = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f"{self.dough.name} {self.size.name} {self.numOfToppings} - {self.price}"


# subs models
class SubSize(models.Model):
    name = models.CharField(max_length=64)

    def __str__(self):
        return f'{self.name}'

class Sub(models.Model):
    name = models.CharField(max_length=64)
    size = models.ForeignKey('SubSize', on_delete=models.CASCADE)
    base_price = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f'{self.name}, {size.name} - {self.base_price}'


class Extra(models.Model):
    name = models.CharField(max_length=64)
    price = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f'{self.name} - {self.price}'

# salad models

class Salad(models.Model):
    name = models.CharField(max_length=64)
    price = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f'{self.name} - {self.price}'


# pasta models

class Pasta(models.Model):
    name = models.CharField(max_length=64)
    price = models.DecimalField(max_digits=5, decimal_places=2)

# platters models

class PlatterSize(models.Model):
    name = models.CharField(max_length=64)

    def __str__(self):
        return f'{self.name}'

class DinnerPlatter(models.Model):
    name = models.CharField(max_length=64)
    size = models.ForeignKey('PlatterSize', on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f'{self.name}, {self.size} - {self.price}'
