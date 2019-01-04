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

function addButtons(container, list, threeInARowBool) {
    let counter = 0;
    for (const item of list) {
        if (threeInARowBool){
            if (counter % 3 === 0) {
                const buttonGroup = document.createElement('div');
                buttonGroup.className = 'btn-group';
                container.appendChild(buttonGroup);
            }
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
        if (threeInARowBool)
            container.lastChild.appendChild(button);
        else
            container.appendChild(button);
        counter++;
    }
}

function addCheckBoxes(container, list, threeInARowBool) {
    let counter = 0;
    for (const item of list) {
        if (threeInARowBool){
            if (counter % 3 === 0) {
                const buttonGroup = document.createElement('div');
                buttonGroup.className = 'btn-group';
                container.appendChild(buttonGroup);
            }
        }
        const context = {
            'model': item.model,
            'name': item.fields.name,
            'id': item.pk
        };
        const buttonText = Handlebars.templates.checkBoxButton(context);
        const div = document.createElement('div');
        div.innerHTML = buttonText;
        const button = div.firstChild;
        if (threeInARowBool) {
            container.lastChild.appendChild(button);
        }
        else {
            container.appendChild(button);
        }
        counter++;
    }
}

function addSelections(container, num, options) {
    container.innerHTML = '';
    for (let i = 0; i < num; i++) {
        const context = {
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
        addButtons(doughChoice, doughs, true);

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
        addButtons(numOfToppingsChoice, numOfToppings, true);

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
        addButtons(pizzaSizesChoice, pizzaSizes, true);

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

function displaySalads() {
    const request = new XMLHttpRequest();
    request.open('POST', '/salads');
    request.onload = function() {
        const data = JSON.parse(request.responseText);
        const salads = JSON.parse(data.salads);
        const saladContainer = document.querySelector('#salad-choice');
        addButtons(saladContainer, salads, false);

        const buttons = saladContainer.children;
        for (let j = 0; j < buttons.length; j++) {
            const button = buttons[j];
            button.onclick = function () {
                this.parentNode.querySelector('.active').classList.remove('active');
                this.classList.add('active'); //yes, a workaround
                calculateSaladPrice(salads);
            }
        }
        calculateSaladPrice(salads);
    }
    const form = new FormData();
    const csrftoken = getCookie('csrftoken');
    form.append('csrfmiddlewaretoken', csrftoken);
    request.send(form);
    return false;
}

function calculateSaladPrice(salads) {
    const saladChoiceContainer = document.querySelector('#salad-choice');
    const saladChoice = saladChoiceContainer.querySelector('.active').firstElementChild.value;
    const price = salads.find(e => e.pk == saladChoice).fields.price;
    const priceContainer = document.querySelector('#salad-price-container');
    if (price) {
        priceContainer.innerHTML = 'Price: ' + price + '$';
    } else {
        priceContainer.innerHTML = 'Unavailiable';
    }
}

function displayPastas() {
    const request = new XMLHttpRequest();
    request.open('POST', '/pastas');
    request.onload = function() {
        const data = JSON.parse(request.responseText);
        const pastas = JSON.parse(data.pastas);
        const pastasContainer = document.querySelector('#pastas-choice');
        addButtons(pastasContainer, pastas, false);

        const buttons = pastasContainer.children;
        for (let i = 0; i < buttons.length; i++) {
            const button = buttons[i];
            button.onclick = function () {
                this.parentNode.querySelector('.active').classList.remove('active');
                this.classList.add('active'); //yes, a workaround
                calculatePastaPrice(pastas);
            }
        }
        calculatePastaPrice(pastas);
    }
    const form = new FormData();
    const csrftoken = getCookie('csrftoken');
    form.append('csrfmiddlewaretoken', csrftoken);
    request.send(form);
    return false;
}

function calculatePastaPrice(pastas) {
    const pastasChoiceContainer = document.querySelector('#pastas-choice');
    const pastaChoice = pastasChoiceContainer.querySelector('.active').firstElementChild.value;
    const price = pastas.find(e => e.pk == pastaChoice).fields.price;
    const priceContainer = document.querySelector('#pasta-price-container');
    if (price) {
        priceContainer.innerHTML = 'Price: ' + price + '$';
    } else {
        priceContainer.innerHTML = 'Unavailiable';
    }
}

function displaySubs() {
    const request = new XMLHttpRequest();
    request.open('POST', '/subs');
    request.onload = function() {
        const data = JSON.parse(request.responseText);
        const sizes = JSON.parse(data.sizes);
        const sizeChoiceContainer = document.querySelector('#sub-size-choice');
        addButtons(sizeChoiceContainer, sizes, true);
        const subs = JSON.parse(data.fillings);
        const subsContainer = document.querySelector('#subs-choice');
        addSelections(subsContainer, 1, subs);
        const extras = JSON.parse(data.extras);
        const extrasContainer = document.querySelector('#extras-choice');
        addCheckBoxes(extrasContainer, extras, true);

        const subPrices = JSON.parse(data.subs);

        const sizeButtonGroups = sizeChoiceContainer.children;
        for (let i = 0; i < sizeButtonGroups.length; i++) {
            const buttonGroup = sizeButtonGroups[i];
            const buttons = buttonGroup.children;
            for (let j = 0; j < buttons.length; j++) {
                const button = buttons[j];
                button.onclick = function () {
                    this.parentNode.parentNode.querySelector('.active').classList.remove('active');
                    this.classList.add('active'); //yes, a workaround
                    calculateSubPrice(subPrices, extras);
                }
            }
        }

        subsContainer.firstElementChild.onchange = function() {
            calculateSubPrice(subPrices, extras);
        }
        const extrasButtonGroups = extrasContainer.children;
        for (let i = 0; i < extrasButtonGroups.length; i++) {
            const buttonGroup = extrasButtonGroups[i];
            const buttons = buttonGroup.children;
            for (let j = 0; j < buttons.length; j++) {
                const button = buttons[j];
                button.onclick = function () {
                    this.classList.toggle('active');
                    calculateSubPrice(subPrices, extras);
                }
            }
        }
        calculateSubPrice(subPrices, extras);
    }
    const form = new FormData();
    const csrftoken = getCookie('csrftoken');
    form.append('csrfmiddlewaretoken', csrftoken);
    request.send(form);
    return false;
}

function calculateSubPrice(subPrices, extras) {
    const subsChoiceContainer = document.querySelector('#subs-choice');
    const selectedIndex = subsChoiceContainer.firstElementChild.selectedIndex;
    const subChoice = subsChoiceContainer.firstElementChild.options[selectedIndex].value;

    const subSizeChoiceContainer = document.querySelector('#sub-size-choice');
    const subSizeChoice = subSizeChoiceContainer.querySelector('.active').firstElementChild.value;
    const subPriceFound = subPrices.find(e => e.fields.filling == subChoice && e.fields.size == subSizeChoice);
    let subPrice = 0;
    if (subPriceFound) {
        subPrice = subPriceFound.fields.base_price;
    }


    const extraChoiceContainer = document.querySelector('#extras-choice');
    const extraChoices = extraChoiceContainer.querySelectorAll('.active');
    let extraSum = 0;
    if (extraChoices) {
        for (let extraChoice of extraChoices) {
            extraSum += parseFloat(extras.find(e => e.pk == extraChoice.value).fields.price);
        }
    }
    const price = parseFloat(subPrice) + parseFloat(extraSum);
    const priceContainer = document.querySelector('#sub-price-container');
    if (subPriceFound) {
        priceContainer.innerHTML = 'Price: ' + price + '$';
    } else {
        priceContainer.innerHTML = 'Unavailiable';
    }
}

function main() {
    displayPizzas();
    displaySalads();
    displayPastas();
    displaySubs();
}

document.addEventListener('DOMContentLoaded', main);
