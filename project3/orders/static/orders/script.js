function localStorageInit() {
    if (!localStorage.getItem('cart')) {
        let cart = {
            pizzas: [],
            pastas: [],
            salads: [],
            subs: [],
            platters: [],
            total: 0
        }
        console.log(cart);
        console.log(JSON.stringify(cart));
        localStorage.setItem('cart', JSON.stringify(cart));
    }
}

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
        addPizzaCartButton(pizzaPrices, toppingList);
        calculatePizzaPrice(pizzaPrices);
    }
    const form = new FormData();
    const csrftoken = getCookie('csrftoken');
    form.append('csrfmiddlewaretoken', csrftoken);
    request.send(form);
    return false;
}

function calculatePizzaPrice(pizzaPrices) {
    const doughChoiceContainer = document.querySelector('#pizza-dough-choice');
    const doughChoiceValue = doughChoiceContainer.querySelector('.active').firstElementChild.value;
    const toppingChoiceContainer = document.querySelector('#pizza-topping-choice');
    const toppingChoiceValue = toppingChoiceContainer.querySelector('.active').firstElementChild.value;
    const sizeChoiceContainer = document.querySelector('#pizza-size-choice');
    const sizeChoiceValue = sizeChoiceContainer.querySelector('.active').firstElementChild.value;
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
        addSaladCartButton(salads);
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

function displayPlatters() {
    const request = new XMLHttpRequest();
    request.open('POST', '/platters');
    request.onload = function() {
        const data = JSON.parse(request.responseText);
        const sizes = JSON.parse(data.sizes);
        const sizeChoiceContainer = document.querySelector('#platter-size-choice');
        addButtons(sizeChoiceContainer, sizes, true);
        const platterNames = JSON.parse(data.names);
        const plattersContainer = document.querySelector('#platter-choice');
        addSelections(plattersContainer, 1, platterNames);
        const platters = JSON.parse(data.platters);

        const sizeButtonGroups = sizeChoiceContainer.children;
        for (let i = 0; i < sizeButtonGroups.length; i++) {
            const buttonGroup = sizeButtonGroups[i];
            const buttons = buttonGroup.children;
            for (let j = 0; j < buttons.length; j++) {
                const button = buttons[j];
                button.onclick = function () {
                    this.parentNode.parentNode.querySelector('.active').classList.remove('active');
                    this.classList.add('active'); //yes, a workaround
                    calculatePlatterPrice(platters);
                }
            }
        }

        plattersContainer.firstElementChild.onchange = function() {
            calculatePlatterPrice(platters);
        }
        calculatePlatterPrice(platters);
    }
    const form = new FormData();
    const csrftoken = getCookie('csrftoken');
    form.append('csrfmiddlewaretoken', csrftoken);
    request.send(form);
    return false;
}

function calculatePlatterPrice(platters) {
    const platterChoiceContainer = document.querySelector('#platter-choice');
    const selectedIndex = platterChoiceContainer.firstElementChild.selectedIndex;
    const platterChoice = platterChoiceContainer.firstElementChild.options[selectedIndex].value;

    const platterSizeChoiceContainer = document.querySelector('#platter-size-choice');
    const platterSizeChoice = platterSizeChoiceContainer.querySelector('.active').firstElementChild.value;
    const price = platters.find(e => e.fields.name == platterChoice && e.fields.size == platterSizeChoice).fields.price;
    const priceContainer = document.querySelector('#platter-price-container');
    if (price) {
        priceContainer.innerHTML = 'Price: ' + price + '$';
    } else {
        priceContainer.innerHTML = 'Unavailiable';
    }
}

function addPizzaCartButton(pizzaPrices, toppings) {
    const addPizzaButton = document.querySelector('#add-pizza-button');
    addPizzaButton.onclick = function() {
        const doughChoiceContainer = document.querySelector('#pizza-dough-choice');
        const doughChoiceValue = doughChoiceContainer.querySelector('.active').firstElementChild.value;
        const toppingChoiceContainer = document.querySelector('#pizza-topping-choice');
        const toppingChoiceValue = toppingChoiceContainer.querySelector('.active').firstElementChild.value;
        const sizeChoiceContainer = document.querySelector('#pizza-size-choice');
        const sizeChoiceValue = sizeChoiceContainer.querySelector('.active').firstElementChild.value;
        const pizza = pizzaPrices.find(e => e.fields.dough == doughChoiceValue && e.fields.numOfToppings == toppingChoiceValue && e.fields.size == sizeChoiceValue);
        const price = pizza.fields.price;
        const toppingContainer = document.querySelector('#topping-container');
        const toppingSelections = toppingContainer.children;
        console.log(toppingSelections);
        const toppingChoices = [];
        for (let topping of toppingSelections) {
            let selectedIndex = topping.selectedIndex;
            let toppingChoice = topping.options[selectedIndex].value;
            let selection = toppings.find(e => e.pk == toppingChoice);
            toppingChoices.push(selection)
        }
        const priceContainer = document.querySelector('#pizza-price');
        if (price) {
            priceContainer.innerHTML = 'Price: ' + price + '$';
        } else {
            priceContainer.innerHTML = 'Unavailiable';
        }
        let newPizzaOrder = {
            pizza: pizza,
            toppings: toppingChoices,
            price: price
        }
        console.log(JSON.parse(localStorage.getItem('cart')));
        let cart = JSON.parse(localStorage.getItem('cart'));
        cart.pizzas.push(newPizzaOrder);
        cart.total += parseFloat(price);
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log(localStorage.getItem('cart'));
    }
}

function addSaladCartButton(salads) {
    const addSaladButton = document.querySelector('#add-salad-button');
    addSaladButton.onclick = function() {
        const saladChoiceContainer = document.querySelector('#salad-choice');
        const saladChoice = saladChoiceContainer.querySelector('.active').firstElementChild.value;
        const salad = salads.find(e => e.pk == saladChoice);
        const price = salad.fields.price;
        const priceContainer = document.querySelector('#salad-price-container');
        if (price) {
            priceContainer.innerHTML = 'Price: ' + price + '$';
        } else {
            priceContainer.innerHTML = 'Unavailiable';
        }
        let newSaladOrder = {
            salad: salad,
            price: price
        }
        let cart = JSON.parse(localStorage.getItem('cart'));
        cart.salads.push(newSaladOrder);
        cart.total += parseFloat(price);
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log(localStorage.getItem('cart'));
    }
}

function main() {
    localStorageInit();
    displayPizzas();
    displaySalads();
    displayPastas();
    displaySubs();
    displayPlatters();
}

document.addEventListener('DOMContentLoaded', main);
