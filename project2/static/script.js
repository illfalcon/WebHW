function checkLocalStorage(){
    if (!localStorage.getItem('username')){
        return false;
    } else {
        return true;
    }
}

function displayYourChannels() {
    const request = new XMLHttpRequest();
    request.open('POST', '/display_your_channels');
    request.onload = function() {
        const data = JSON.parse(request.responseText);
        for (i in data.channels){
            let div = document.createElement("div");
            div.innerHTML = data.channels[i].name;
            document.querySelector("#yourChannelsList").appendChild(div);
        }
    }
    const username = localStorage.getItem('username');
    const form = new FormData();
    form.append('username', username);
    request.send(form);
    return false;
}

function displayAllChannels() {
    const request = new XMLHttpRequest();
    request.open('POST', '/display_all_channels');
    request.onload = function() {
        const data = JSON.parse(request.responseText);
        for (i in data.channels){
            let div = document.createElement("div");
            div.innerHTML = data.channels[i].name;
            document.querySelector("#allChannelsList").appendChild(div);
        }
    }
    request.send();
    return false;
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
        displayYourChannels();
        return false;
    }

    document.querySelector("#createChannelButton").onclick = function() {
        document.querySelector("#createChannelDiv").style.display = "block";
    }

    socket.on('connect', function() {
        document.querySelector("#newChannelSubmit").onclick = function() {
            const channelName = document.querySelector("#channelName").value;
            const channelCreator = localStorage.getItem('username');
            document.querySelector("#createChannelDiv").style.display = "none";
            socket.emit('create channel', {'channelName': channelName, 'channelCreator': channelCreator});
        }
    })

    socket.on('announce channel', function(data) {
        let div1 = document.createElement("div");
        div1.innerHTML = data.channelName;
        let div2 = document.createElement("div");
        div2.innerHTML = data.channelName;

        yourChannels = document.querySelector('#yourChannelsList');
        allChannels = document.querySelector('#allChannelsList');

        if (localStorage['username'] === data.channelCreator) {
            yourChannels.appendChild(div1);
        }
        allChannels.appendChild(div2);
    })

    // implementing main function

    if (checkLocalStorage()){
        document.querySelector("#user").innerHTML = localStorage.getItem('username');
        displayYourChannels();
    } else {
        document.querySelector("#sign-in").style.display = "block";
    }

    displayAllChannels();

}

document.addEventListener('DOMContentLoaded', main);
