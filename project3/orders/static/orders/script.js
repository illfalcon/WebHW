function localStorageInit() {
    if (!localStorage.getItem('cart')) {
        let cart = {
            objId: 0,
            pizzas: [],
            pastas: [],
            salads: [],
            subs: [],
            platters: [],
            total: 0
        }
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    if (!localStorage.getItem('needToPay')) {
        localStorage.setItem('needToPay', 0);
    }
}

function getCookie(cname) {
  const name = cname + "=";
  const ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
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
        addPizzaCartButton(pizzaPrices, toppingList, doughs, pizzaSizes);
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
        addPastaCartButton(pastas);
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
        addSubCartButton(sizes, subs, subPrices, extras)
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
    let price = parseFloat(subPrice) + parseFloat(extraSum);
    price = price.toFixed(2);
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
        addPlatterCartButton(sizes, platterNames, platters);
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

function addPizzaCartButton(pizzaPrices, toppings, doughs, pizzaSizes) {
    const addPizzaButton = document.querySelector('#add-pizza-button');
    addPizzaButton.onclick = function() {
        const doughChoiceContainer = document.querySelector('#pizza-dough-choice');
        const doughChoiceValue = doughChoiceContainer.querySelector('.active').firstElementChild.value;
        const dough = doughs.find(e => e.pk == doughChoiceValue).fields.name;
        const toppingChoiceContainer = document.querySelector('#pizza-topping-choice');
        const toppingChoiceValue = toppingChoiceContainer.querySelector('.active').firstElementChild.value;
        const sizeChoiceContainer = document.querySelector('#pizza-size-choice');
        const sizeChoiceValue = sizeChoiceContainer.querySelector('.active').firstElementChild.value;
        const pizzaSize = pizzaSizes.find(e => e.pk == sizeChoiceValue).fields.name;
        const pizza = pizzaPrices.find(e => e.fields.dough == doughChoiceValue && e.fields.numOfToppings == toppingChoiceValue && e.fields.size == sizeChoiceValue);
        const price = pizza.fields.price;
        const toppingContainer = document.querySelector('#topping-container');
        const toppingSelections = toppingContainer.children;
        const toppingChoices = [];
        for (let topping of toppingSelections) {
            let selectedIndex = topping.selectedIndex;
            let toppingChoice = topping.options[selectedIndex].value;
            let selection = toppings.find(e => e.pk == toppingChoice).fields.name;
            toppingChoices.push(selection);
        }
        let cart = JSON.parse(localStorage.getItem('cart'));
        let newPizzaOrder = {
            id: cart.objId,
            size: pizzaSize,
            dough: dough,
            toppings: toppingChoices,
            price: price
        }
        cart.objId += 1;
        cart.pizzas.push(newPizzaOrder);
        cart.total += parseFloat(price);
        localStorage.setItem('cart', JSON.stringify(cart));
    }
}

function addSaladCartButton(salads) {
    const addSaladButton = document.querySelector('#add-salad-button');
    addSaladButton.onclick = function() {
        const saladChoiceContainer = document.querySelector('#salad-choice');
        const saladChoice = saladChoiceContainer.querySelector('.active').firstElementChild.value;
        const salad = salads.find(e => e.pk == saladChoice);
        const saladName = salad.fields.name;
        const price = salad.fields.price;
        let cart = JSON.parse(localStorage.getItem('cart'));
        let newSaladOrder = {
            id: cart.objId,
            salad: saladName,
            price: price
        }
        cart.objId += 1;
        cart.salads.push(newSaladOrder);
        cart.total += parseFloat(price);
        localStorage.setItem('cart', JSON.stringify(cart));
    }
}

function addPastaCartButton(pastas) {
    const addPastaButton = document.querySelector('#add-pasta-button');
    addPastaButton.onclick = function() {
        const pastaChoiceContainer = document.querySelector('#pastas-choice');
        const pastaChoice = pastaChoiceContainer.querySelector('.active').firstElementChild.value;
        const pasta = pastas.find(e => e.pk == pastaChoice);
        const pastaName = pasta.fields.name;
        const price = pasta.fields.price;
        let cart = JSON.parse(localStorage.getItem('cart'));
        let newPastaOrder = {
            id: cart.objId,
            pasta: pastaName,
            price: price
        }
        cart.objId += 1;
        cart.pastas.push(newPastaOrder);
        cart.total += parseFloat(price);
        localStorage.setItem('cart', JSON.stringify(cart));
    }
}

function addSubCartButton(sizes, subs, subPrices, extras) {
    const addSubButton = document.querySelector('#add-sub-button');
    addSubButton.onclick = function() {
        const subsChoiceContainer = document.querySelector('#subs-choice');
        const selectedIndex = subsChoiceContainer.firstElementChild.selectedIndex;
        const subChoice = subsChoiceContainer.firstElementChild.options[selectedIndex].value;
        const sub = subs.find(e => e.pk == subChoice).fields.name;
        const subSizeChoiceContainer = document.querySelector('#sub-size-choice');
        const subSizeChoice = subSizeChoiceContainer.querySelector('.active').firstElementChild.value;
        const size = sizes.find(e => e.pk == subSizeChoice).fields.name;
        const subPriceFound = subPrices.find(e => e.fields.filling == subChoice && e.fields.size == subSizeChoice);
        let subPrice = 0;
        if (subPriceFound) {
            subPrice = subPriceFound.fields.base_price;
        }
        const extraChoiceContainer = document.querySelector('#extras-choice');
        const extraChoices = extraChoiceContainer.querySelectorAll('.active');
        let extraSum = 0;
        const extrasFound = [];
        if (extraChoices) {
            for (let extraChoice of extraChoices) {
                extraSum += parseFloat(extras.find(e => e.pk == extraChoice.value).fields.price);
                extrasFound.push(extras.find(e => e.pk == extraChoice.value).fields.name);
            }
        }
        const price = parseFloat(subPrice) + parseFloat(extraSum);
        let cart = JSON.parse(localStorage.getItem('cart'));
        let newSubOrder = {
            id: cart.objId,
            size: size,
            sub: sub,
            extras: extrasFound,
            price: price.toFixed(2)
        };
        cart.objId += 1;
        cart.subs.push(newSubOrder);
        cart.total += parseFloat(price);
        localStorage.setItem('cart', JSON.stringify(cart));
    }
}

function addPlatterCartButton(sizes, platterNames, platters) {
    const addPlatterButton = document.querySelector('#add-platter-button');
    addPlatterButton.onclick = function () {
        const platterChoiceContainer = document.querySelector('#platter-choice');
        const selectedIndex = platterChoiceContainer.firstElementChild.selectedIndex;
        const platterChoice = platterChoiceContainer.firstElementChild.options[selectedIndex].value;
        const platterName = platterNames.find(e => e.pk == platterChoice).fields.name;
        const platterSizeChoiceContainer = document.querySelector('#platter-size-choice');
        const platterSizeChoice = platterSizeChoiceContainer.querySelector('.active').firstElementChild.value;
        const size = sizes.find(e => e.pk == platterSizeChoice).fields.name;
        const platter = platters.find(e => e.fields.name == platterChoice && e.fields.size == platterSizeChoice);
        const price = platter.fields.price;
        let cart = JSON.parse(localStorage.getItem('cart'));
        let newPlatterOrder = {
            id: cart.objId,
            size: size,
            platter: platterName,
            price: price
        };
        cart.objId += 1;
        cart.platters.push(newPlatterOrder);
        cart.total += parseFloat(price);
        localStorage.setItem('cart', JSON.stringify(cart));
    }
}

function checkBox() {
    const authRequest = new XMLHttpRequest();
    authRequest.open('POST', '/auth');
    authRequest.onload = function () {
        const data = JSON.parse(authRequest.responseText);
        if (data.isLoggedIn) {
            document.querySelector('#login-button').remove();
            document.querySelector('#register-button').remove();
            const checkBox = document.querySelector('#discount-checkbox');
            checkBox.classList.remove('disabled-custom');
            checkBox.onclick = function () {
                const total = document.querySelector('#total');
                const withOut = JSON.parse(localStorage.getItem('cart')).total;
                const cb = document.querySelector('#cb');
                if (cb.checked) {
                    total.innerHTML = 'Total: ' + (parseFloat(withOut) - parseFloat(withOut) * 0.05).toFixed(2) + '$';
                    localStorage.getItem('needToPay', parseFloat(withOut) - parseFloat(withOut) * 0.05);
                } else {
                    total.innerHTML ='Total: ' +  withOut.toFixed(2) + '$';
                    localStorage.setItem('needToPay', withOut);
                }
            }
        }
    }
    const authForm = new FormData();
    const csrftoken = getCookie('csrftoken');
    authForm.append('csrfmiddlewaretoken', csrftoken);
    authRequest.send(authForm);
    return false;
}

function displayCart() {
    const cartButton = document.querySelector('#cart-button');
    cartButton.onclick = function() {
        const menu = document.querySelector('#menu-row');
        menu.classList.add('disabled-custom');
        const navbar = document.querySelector('#navbar');
        navbar.classList.add('disabled-custom');
        console.log(JSON.parse(localStorage.getItem('cart')));
        const cartObj = JSON.parse(localStorage.getItem('cart'));
        cartObj.total = parseFloat(cartObj.total).toFixed(2);
        const cartText = Handlebars.templates.cart(cartObj);
        const div = document.createElement('div');
        div.innerHTML = cartText;
        const cart = div.firstElementChild;
        const cartRow = document.querySelector('#cart-row');;
        cartRow.appendChild(cart);

        checkBox();

        const deleteButtons = cart.querySelectorAll('.delete-button');
        for (let deleteButton of deleteButtons) {
            deleteButton.onclick = function() {
                const price = this.getAttribute('data-price');
                cartObj.total -= parseFloat(price);
                const id = this.id;
                const category = this.parentNode.id;
                switch (category) {
                    case 'pizza-container':
                        let i = cartObj.pizzas.findIndex(e => e.id == id);
                        cartObj.pizzas.splice(i, 1);
                        break;
                    case 'pasta-container':
                        let j = cartObj.pastas.findIndex(e => e.id == id);
                        cartObj.pastas.splice(j, 1);
                        break;
                    case 'salad-container':
                        let k = cartObj.salads.findIndex(e => e.id == id);
                        cartObj.salads.splice(k, 1);
                        break;
                    case 'sub-container':
                        let l = cartObj.subs.findIndex(e => e.id == id);
                        cartObj.subs.splice(l, 1);
                        break;
                    case 'platter-container':
                        let m = cartObj.platters.findIndex(e => e.id == id);
                        cartObj.platters.splice(m, 1);
                        break;
                }

                localStorage.setItem('cart', JSON.stringify(cartObj));
                const total = document.querySelector('#total');
                total.innerHTML = 'Total ' + cartObj.total.toFixed(2) + '$';
                this.parentNode.remove();
            }
        }
        const backToShopping = cart.querySelector('#back-to-shopping');
        backToShopping.onclick = function() {
            menu.classList.remove('disabled-custom');
            navbar.classList.remove('disabled-custom');
            document.querySelector('#cart').remove();
        }
        const loginButton = cart.querySelector('#login-button');
        loginButton.onclick = function () {
            const loginWindowText = Handlebars.templates.loginForm();
            const div = document.createElement('div');
            div.innerHTML = loginWindowText;
            const loginWindow = div.firstElementChild;
            setUpLoginWindow(loginWindow);
            document.querySelector('#login-row').appendChild(loginWindow);
            document.querySelector('#cart').remove();
        }
        const registerButton = cart.querySelector('#register-button');
        registerButton.onclick = function () {
            const registrationWindowText = Handlebars.templates.registrationForm();
            const div = document.createElement('div');
            div.innerHTML = registrationWindowText;
            const registrationWindow = div.firstElementChild;
            setUpRegisterWindow(registrationWindow);
            document.querySelector('#register-row').appendChild(registrationWindow);
            document.querySelector('#cart').remove();
        }
        const placeOrder = cart.querySelector('#place-an-order');
        placeOrder.onclick = function () {
            const request = new XMLHttpRequest();
            request.open('POST', '/order');
            request.onload = function() {
                const data = JSON.parse(request.responseText);
                if (data.success == 'True') {
                    let newCart = {
                        objId: 0,
                        pizzas: [],
                        pastas: [],
                        salads: [],
                        subs: [],
                        platters: [],
                        total: 0
                    }
                    localStorage.setItem('cart', JSON.stringify(newCart));
                    menu.classList.remove('disabled-custom');
                    navbar.classList.remove('disabled-custom');
                    document.querySelector('#cart').remove();
                    alert('Order made!')
                } else {
                    alert('Error');
                }
            }
            const form = new FormData();
            const csrftoken = getCookie('csrftoken');
            form.append('csrfmiddlewaretoken', csrftoken);
            form.append('cart', localStorage.getItem('cart'));
            request.send(form);
            return false;
        }
    }
}

function setUpLoginWindow(loginWindow) {
    const backToShoppingFromLoginButton = loginWindow.querySelector('#back-to-shopping-from-login');
    backToShoppingFromLoginButton.onclick = function () {
        document.querySelector('#menu-row').classList.remove('disabled-custom');
        document.querySelector('#navbar').classList.remove('disabled-custom');
        document.querySelector('#login-form').remove();
    }
    const loginButton = loginWindow.querySelector('#send-login-button');
    loginButton.onclick = function () {
        const request = new XMLHttpRequest();
        request.open('POST', '/login');
        request.onload = function () {
            const data = JSON.parse(request.responseText);
            if (data.success) {
                alert('Logged In Successfully');
                document.querySelector('#menu-row').classList.remove('disabled-custom');
                document.querySelector('#navbar').classList.remove('disabled-custom');
                document.querySelector('#login-form').remove();
                authenticate();
            } else {
                alert('Error');
            }
        }
        const login = loginWindow.querySelector('#login-username').value;
        const password = loginWindow.querySelector('#login-password').value;
        const form = new FormData();
        const csrftoken = getCookie('csrftoken');
        form.append('csrfmiddlewaretoken', csrftoken);
        form.append('login', login);
        form.append('password', password);
        request.send(form);
        return false;
    }
}

function setUpRegisterWindow(registrationWindow) {
    const backToShoppingFromRegistrationButton = registrationWindow.querySelector('#back-to-shopping-from-registration');
    backToShoppingFromRegistrationButton.onclick = function () {
        document.querySelector('#menu-row').classList.remove('disabled-custom');
        document.querySelector('#navbar').classList.remove('disabled-custom');
        document.querySelector('#registration-form').remove();
    }
    const regButton = registrationWindow.querySelector('#send-registration-button');
    regButton.onclick = function () {
        const request = new XMLHttpRequest();
        request.open('POST', '/register');
        request.onload = function () {
            const data = JSON.parse(request.responseText);
            console.log(data);
            if (data.success) {
                alert('Registered Successfully');
                document.querySelector('#menu-row').classList.remove('disabled-custom');
                document.querySelector('#navbar').classList.remove('disabled-custom');
                document.querySelector('#registration-form').remove();
                authenticate();
            } else {
                alert(data.errMsg);
            }
        }
        const username = registrationWindow.querySelector('#registration-username').value;
        const name = registrationWindow.querySelector('#registration-name').value;
        const surname = registrationWindow.querySelector('#registration-surname').value;
        const email = registrationWindow.querySelector('#registration-email').value;
        const password = registrationWindow.querySelector('#registration-password').value;
        const form = new FormData();
        const csrftoken = getCookie('csrftoken');
        form.append('csrfmiddlewaretoken', csrftoken);
        form.append('username', username);
        form.append('name', name);
        form.append('surname', surname);
        form.append('email', email);
        form.append('password', password);
        request.send(form);
        return false;
    }
}

function authenticate() {
    const navbar = document.querySelector('#navbar');
    const cartBut = document.querySelector('#cart-button')
    while (navbar.lastChild != cartBut) {
        navbar.removeChild(navbar.lastChild);
    }
    const request = new XMLHttpRequest();
    request.open('POST', '/auth');
    request.onload = function() {
        const data = JSON.parse(request.responseText);
        if (data.isLoggedIn) {
            const logOutDiv = document.createElement('div');
            logOutDiv.innerHTML = 'Log Out'
            logOutDiv.classList.add('col-2');
            logOutDiv.classList.add('btn');
            logOutDiv.classList.add('btn-secondary');
            logOutDiv.id = 'logout-button';
            logOutDiv.onclick = function () {
                logOut();
            };
            document.querySelector('#navbar').appendChild(logOutDiv);
        } else {
            const logInDiv = document.createElement('div');
            logInDiv.innerHTML = 'Log In'
            logInDiv.classList.add('col-2');
            logInDiv.classList.add('btn');
            logInDiv.classList.add('btn-secondary');
            logInDiv.id = 'login-main-button';
            logInDiv.onclick = function() {
                logIn()
            };
            document.querySelector('#navbar').appendChild(logInDiv);
            const registerDiv = document.createElement('div');
            registerDiv.innerHTML = 'Register'
            registerDiv.classList.add('col-2');
            registerDiv.classList.add('btn');
            registerDiv.classList.add('btn-secondary');
            registerDiv.id = 'register-main-button';
            registerDiv.onclick = function() {
                register()
            };
            document.querySelector('#navbar').appendChild(registerDiv);
        }
    }
    const form = new FormData();
    const csrftoken = getCookie('csrftoken');
    form.append('csrfmiddlewaretoken', csrftoken);
    request.send(form);
    return false;
}

function logOut() {
    const request = new XMLHttpRequest();
    request.open('POST', '/logout');
    request.onload = function () {
        authenticate();
    }
    const form = new FormData();
    const csrftoken = getCookie('csrftoken');
    form.append('csrfmiddlewaretoken', csrftoken);
    request.send(form);
    return false;
}

function logIn() {
    const loginWindowText = Handlebars.templates.loginForm();
    const div = document.createElement('div');
    div.innerHTML = loginWindowText;
    const loginWindow = div.firstElementChild;
    setUpLoginWindow(loginWindow);
    document.querySelector('#login-row').appendChild(loginWindow);
}

function register() {
    const registrationWindowText = Handlebars.templates.registrationForm();
    const div = document.createElement('div');
    div.innerHTML = registrationWindowText;
    const registrationWindow = div.firstElementChild;
    setUpRegisterWindow(registrationWindow);
    document.querySelector('#register-row').appendChild(registrationWindow);
    document.querySelector('#cart').remove();
}

function main() {
    localStorageInit();
    authenticate();
    displayCart();
    displayPizzas();
    displaySalads();
    displayPastas();
    displaySubs();
    displayPlatters();
}

document.addEventListener('DOMContentLoaded', main);
