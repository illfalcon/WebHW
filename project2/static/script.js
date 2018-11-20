function checkLocalStorage(){
    if (!localStorage.getItem('username')){
        return false;
    } else {
        return true;
    }
}

function refreshYourChannels() {
    const request = new XMLHttpRequest();
    request.open('POST', '/refresh_your_channels');
    request.onload = () => {
        const data = JSON.parse(request.responseText);
        console.log(data.channels);
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
        document.querySelector("#newChannelSubmit").onclick = function() {
            const channelName = document.querySelector("#channelName").value;
            const channelCreator = localStorage.getItem('username');
            socket.emit('create channel', {'channelName': channelName, 'channelCreator': channelCreator});
            refreshYourChannels();
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
