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

function displayPizzas(arrayOfPizzaArrays) {
    const request = new XMLHttpRequest();
    request.open('POST', '/pizzas');
    request.onload = function() {
        const data = JSON.parse(request.responseText);
        const doughs = JSON.parse(data.doughs);
        console.log(data);
        const doughChoice = document.querySelector('#pizza-dough-choice');
        addButtons(doughChoice, doughs);
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
                }
            }
        }
        const pizzaSizes = JSON.parse(data.pizzaSizes);
        const pizzaSizesChoice = document.querySelector('#pizza-size-choice');
        addButtons(pizzaSizesChoice, pizzaSizes);
    }
    const form = new FormData();
    const csrftoken = getCookie('csrftoken');
    form.append('csrfmiddlewaretoken', csrftoken);
    request.send(form);
    return false;
}

function calculatePizzaPrice() {
    const doughChoiceContainer = document.getElementById('pizza-dough-choice');
    const toppingChoiceContainer = document.querySelector('#pizza-topping-choice');
    const sizeChoiceContainer = document.querySelector('#pizza-size-choice');
    // const toppingChoice = toppingChoiceContainer.querySelector('.active').firstElementChild.value;
    // const sizeChoice = sizeChoiceContainer.querySelector('.active').firstElementChild.value;
}

function main() {
    displayPizzas();
    calculatePizzaPrice();
}

document.addEventListener('DOMContentLoaded', main);
