function checkLocalStorage(){
    if (!localStorage.getItem('username')){
        return false;
    } else {
        return true;
    }
}

var createChannelHtml = document.createElement("div");
createChannelHtml.innerHTML =
'<div class="row">' +
    '<div class="col-12" id="createChannelDiv">' +
        '<form class="createChannelForm" action="#" method="post">' +
            '<input type="text" id="channelName" placeholder="Channel Name">' +
            '<button type="submit" id="newChannelSubmit" name="button">Submit</button>' +
        '</form>' +
    '</div>' +
'</div>';

function main(){
    var username;
    document.querySelector("#sign-in-form").onsubmit = function() {
        username = document.querySelector("#username").value;
        document.querySelector("#sign-in").style.display = "none";
        localStorage.setItem('username', username);
        document.querySelector("#user").innerHTML = localStorage.getItem('username');

        return false;
    }

    document.querySelector("#createChannelButton").onclick = function() {
        document.querySelector(".container-fluid").appendChild(createChannelHtml);
    }

    if (checkLocalStorage()){
        document.querySelector("#user").innerHTML = localStorage.getItem('username');
    } else {
        document.querySelector("#sign-in").style.display = "block";
    }
}

document.addEventListener('DOMContentLoaded', main);
