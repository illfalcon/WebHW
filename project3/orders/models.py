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

class NumOfToppings(models.Model):
    name = models.CharField(max_length=64)
    num = models.IntegerField()

    def __str__(self):
        return f"{self.name}"


class PizzaSize(models.Model):
    name = models.CharField(max_length=64)
    def __str__(self):
        return f"{self.name}"


class Pizza(models.Model):
    dough = models.ForeignKey('Dough', on_delete=models.CASCADE)
    size = models.ForeignKey('PizzaSize', on_delete=models.CASCADE)
    numOfToppings = models.ForeignKey('NumOfToppings', on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f"{self.dough.name} {self.size.name} {self.numOfToppings.name} - {self.price}"


# subs models
class SubSize(models.Model):
    name = models.CharField(max_length=64)

    def __str__(self):
        return f'{self.name}'

class SubFilling(models.Model):
    name = models.CharField(max_length=64)

    def __str__(self):
        return f'{self.name}'

class Sub(models.Model):
    filling = models.ForeignKey('SubFilling', on_delete=models.CASCADE)
    size = models.ForeignKey('SubSize', on_delete=models.CASCADE)
    base_price = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f'{self.filling.name}, {self.size.name} - {self.base_price}'


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

    def __str__(self):
        return f'{self.name} - {self.price}'
# platters models

class PlatterSize(models.Model):
    name = models.CharField(max_length=64)

    def __str__(self):
        return f'{self.name}'

class PlatterName(models.Model):
    name = models.CharField(max_length=64)

    def __str__(self):
        return f'{self.name}'

class DinnerPlatter(models.Model):
    name = models.ForeignKey('PlatterName', on_delete=models.CASCADE)
    size = models.ForeignKey('PlatterSize', on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f'{self.name}, {self.size} - {self.price}'
