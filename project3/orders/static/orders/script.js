function getCookie(cname) {
  const name = cname + "=";
  const ca = document.cookie.split(';');
  for(const i = 0; i < ca.length; i++) {
    const c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function addButtons(container, list) {
    let counter = 0;
    for (const item of list) {
        if (counter % 3 === 0) {
            const buttonGroup = document.createElement('div');
            buttonGroup.className = 'btn-group';
            container.appendChild(buttonGroup);
        }
        const context = {
            'model': item.model,
            'name': item.fields.name,
            'id': item.pk
        };
        const buttonText = Handlebars.templates.pizzaButton(context);
        const div = document.createElement('div');
        div.innerHTML = buttonText;
        const button = div.firstChild;
        if (counter === 0) {
            button.classList.add('active');
            // button.checked = true;
        }
        container.lastChild.appendChild(button);
        counter++;
    }
}

function addSelections(container, num, options) {
    container.innerHTML = '';
    for (let i = 0; i < num; i++) {
        const context = {
            "number": i+1,
            "options": options
        };
        const selectionText = Handlebars.templates.toppingSelectionTemplate(context);
        const div = document.createElement('div');
        div.innerHTML = selectionText;
        const selection = div.firstChild;
        container.appendChild(selection);
    }
}

function displayPizzas() {
    const request = new XMLHttpRequest();
    request.open('POST', '/pizzas');
    request.onload = function() {
        const data = JSON.parse(request.responseText);
        const pizzaPrices = JSON.parse(data.pizzaPrices);
        const doughs = JSON.parse(data.doughs);
        console.log(data);
        const doughChoice = document.querySelector('#pizza-dough-choice');
        addButtons(doughChoice, doughs);

        const doughButtonGroups = doughChoice.children;
        for (let i = 0; i < doughButtonGroups.length; i++) {
            const buttonGroup = doughButtonGroups[i];
            const buttons = buttonGroup.children;
            for (let j = 0; j < buttons.length; j++) {
                const button = buttons[j];
                button.onclick = function () {
                    this.parentNode.parentNode.querySelector('.active').classList.remove('active');
                    this.classList.add('active'); //yes, a workaround
                    calculatePizzaPrice(pizzaPrices);
                }
            }
        }

        const numOfToppings = JSON.parse(data.numOfToppings);
        const numOfToppingsChoice = document.querySelector('#pizza-topping-choice');
        addButtons(numOfToppingsChoice, numOfToppings);

        const toppingButtonGroups = numOfToppingsChoice.children;
        const toppingList = JSON.parse(data.toppings);
        for (let i = 0; i < toppingButtonGroups.length; i++) {
            const buttonGroup = toppingButtonGroups[i];
            const buttons = buttonGroup.children;
            for (let j = 0; j < buttons.length; j++) {
                const button = buttons[j];
                button.onclick = function () {
                    const numberOfToppingsChoice = this.firstElementChild.value;
                    const num = numOfToppings.find(e => {
                        return (e.pk == numberOfToppingsChoice);
                    }).fields.num;
                    const container = document.querySelector('#topping-container');
                    addSelections(container, num, toppingList);
                    this.parentNode.parentNode.querySelector('.active').classList.remove('active');
                    this.classList.add('active'); //yes, a workaround
                    calculatePizzaPrice(pizzaPrices);
                }
            }
        }

        const pizzaSizes = JSON.parse(data.pizzaSizes);
        const pizzaSizesChoice = document.querySelector('#pizza-size-choice');
        addButtons(pizzaSizesChoice, pizzaSizes);

        const pizzaSizesButtonGroups = pizzaSizesChoice.children;
        for (let i = 0; i < pizzaSizesButtonGroups.length; i++) {
            const buttonGroup = pizzaSizesButtonGroups[i];
            const buttons = buttonGroup.children;
            for (let j = 0; j < buttons.length; j++) {
                const button = buttons[j];
                button.onclick = function () {
                    this.parentNode.parentNode.querySelector('.active').classList.remove('active');
                    this.classList.add('active'); //yes, a workaround
                    calculatePizzaPrice(pizzaPrices);
                }
            }
        }

        calculatePizzaPrice(pizzaPrices);
    }
    const form = new FormData();
    const csrftoken = getCookie('csrftoken');
    form.append('csrfmiddlewaretoken', csrftoken);
    request.send(form);
    return false;
}

function calculatePizzaPrice(pizzaPrices) {
    console.log(pizzaPrices);
    const doughChoiceContainer = document.querySelector('#pizza-dough-choice');
    const doughChoiceValue = doughChoiceContainer.querySelector('.active').firstElementChild.value;
    console.log(doughChoiceValue);
    const toppingChoiceContainer = document.querySelector('#pizza-topping-choice');
    const toppingChoiceValue = toppingChoiceContainer.querySelector('.active').firstElementChild.value;
    console.log(toppingChoiceValue);
    const sizeChoiceContainer = document.querySelector('#pizza-size-choice');
    const sizeChoiceValue = sizeChoiceContainer.querySelector('.active').firstElementChild.value;
    console.log(sizeChoiceValue);
    const price = pizzaPrices.find(e => e.fields.dough == doughChoiceValue && e.fields.numOfToppings == toppingChoiceValue && e.fields.size == sizeChoiceValue).fields.price;
    const priceContainer = document.querySelector('#pizza-price');
    if (price) {
        priceContainer.innerHTML = 'Price: ' + price + '$';
    } else {
        priceContainer.innerHTML = 'Unavailiable';
    }
}

function main() {
    displayPizzas();
}

document.addEventListener('DOMContentLoaded', main);
