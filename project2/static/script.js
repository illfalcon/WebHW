function checkLocalStorage(){
    if (!localStorage.getItem('username')){
        return false;
    } else {
        return true;
    }
}

function main(){
    var username;
    document.querySelector("#sign-in-form").onsubmit = function() {
        username = document.querySelector("#username").value;
        document.querySelector("#sign-in").style.display = "none";
        localStorage.setItem('username', username);

        return false;
    }
    if (checkLocalStorage()){
        document.querySelector("#user").innerHTML = localStorage.getItem('username');
    } else {
        document.querySelector("#sign-in").style.display = "block";
    }
    document.querySelector("#user").innerHTML = localStorage.getItem('username');
}

document.addEventListener('DOMContentLoaded', main);
