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
