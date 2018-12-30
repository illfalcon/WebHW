function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function displayPizzas() {
    const request = new XMLHttpRequest();
    request.open('POST', '/pizzas');
    request.onload = function() {
        const data = JSON.parse(request.responseText);
        console.log(data);
        const doughs = JSON.parse(data.doughs);
        let counter = 0;
        for (const dough of doughs) {
            const doughChoice = document.querySelector('#pizza-dough-choice');
            if (counter % 3 === 0) {
                const buttonGroup = document.createElement('div');
                buttonGroup.className = 'btn-group';
                doughChoice.append(buttonGroup);
            }
            console.log(dough);
            console.log(dough.fields);
            console.log(dough.fields.name);
            const context = {
                'name': dough.fields.name,
                'id': dough.pk
            }
            const buttonText = Handlebars.templates.pizzaButton(context);
            const div = document.createElement('div');
            div.innerHTML = buttonText;
            console.log(div);
            const button = div.firstChild;
            console.log(button);
            console.log(button.firstChild);
            if (counter === 0) {
                button.classList.add('active');
                button.firstElementChild.checked = true;
            }
            doughChoice.lastChild.append(button);
            counter++;
        }
    }
    const form = new FormData();
    const csrftoken = getCookie('csrftoken');
    form.append('csrfmiddlewaretoken', csrftoken);
    request.send(form);
    return false;
}

function main() {
    displayPizzas();
}

document.addEventListener('DOMContentLoaded', main);
