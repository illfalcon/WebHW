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
            console.log(data.channels[i]);
            let li = document.createElement("li");
            li.innerHTML = data.channels[i].name;
            document.querySelector("#yourChannelsList").appendChild(li);
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
            console.log(data.channels[i]);
            let li = document.createElement("li");
            li.innerHTML = data.channels[i].name;
            document.querySelector("#allChannelsList").appendChild(li);
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
            socket.emit('create channel', {'channelName': channelName, 'channelCreator': channelCreator});
        }
    })

    socket.on('announce channel', function(data) {
        let li1 = document.createElement("li");
        li1.innerHTML = data.channelName;
        let li2 = document.createElement("li");
        li2.innerHTML = data.channelName;

        yourChannels = document.querySelector('#yourChannelsList');
        allChannels = document.querySelector('#allChannelsList');

        if (localStorage['username'] === data.channelCreator) {
            yourChannels.appendChild(li1);
        }
        allChannels.appendChild(li2);
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
