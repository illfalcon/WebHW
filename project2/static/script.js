function checkLocalStorage(){
    if (!localStorage.getItem('username')){
        return false;
    } else {
        return true;
    }
}

function main(){
    var username;
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // setting event listeners

    document.querySelector("#sign-in-form").onsubmit = function() {
        username = document.querySelector("#username").value;
        document.querySelector("#sign-in").style.display = "none";
        localStorage.setItem('username', username);
        document.querySelector("#user").innerHTML = localStorage.getItem('username');

        return false;
    }

    document.querySelector("#createChannelButton").onclick = function() {
        document.querySelector("#createChannelDiv").style.display = "block";
    }

    socket.on('connect', () => {
        document.querySelector("#createChannelForm").onsubmit = function() {
            const channelName = document.querySelector("#channelName").value;
            const channelCreator = localStorage.getItem('username');
            socket.emit('create channel', {'channelName': channelName, 'channelCreator': channelCreator});
            return false;
        }
    })

    socket.on('announce channel', data => {
        const li = document.createElement("li");
        li.innerHTML = data.channelName;
        document.querySelector('#allChannelsList').appendChild(li);
    })

    // implementing main function

    if (checkLocalStorage()){
        document.querySelector("#user").innerHTML = localStorage.getItem('username');
    } else {
        document.querySelector("#sign-in").style.display = "block";
    }
}

document.addEventListener('DOMContentLoaded', main);
