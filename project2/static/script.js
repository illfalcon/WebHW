function checkLocalStorage(){
    if (!localStorage.getItem('username')){
        return false;
    } else {
        return true;
    }
}

function selectChannel(div) {
    localStorage.setItem('openedChannel', div.innerHTML);
    listOfChannels = div.parentNode.childNodes;
    console.log(listOfChannels);
    for (channel of listOfChannels) {
        channel.style.backgroundColor = "white";
    }
    div.style.backgroundColor = "red";
    // TODO: implement message displaying function
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
            localStorage.getItem('openedChannel') === div.innerHTML ? div.style.backgroundColor = "red" : div.style.backgroundColor = "white";
            div.onmouseover = function() { div.style.backgroundColor = "blue"; }
            div.onmouseout = function() { localStorage.getItem('openedChannel') === div.innerHTML ? div.style.backgroundColor = "red" : div.style.backgroundColor = "white"; }
            div.onclick = function() {
                localStorage.setItem('openedChannel', div.innerHTML);
                listOfChannels = div.parentNode.childNodes;
                console.log(listOfChannels);
                for (channel of listOfChannels) {
                    channel.style.backgroundColor = "white";
                }
                div.style.backgroundColor = "red";
                // TODO: implement message displaying function
            }
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
            localStorage.getItem('openedChannel') === div.innerHTML ? div.style.backgroundColor = "red" : div.style.backgroundColor = "white";
            div.onmouseover = function() { div.style.backgroundColor = "blue"; }
            div.onmouseout = function() { localStorage.getItem('openedChannel') === div.innerHTML ? div.style.backgroundColor = "red" : div.style.backgroundColor = "white"; }
            div.onclick = function() {
                localStorage.setItem('openedChannel', div.innerHTML);
                listOfChannels = div.parentNode.childNodes;
                console.log(listOfChannels);
                for (channel of listOfChannels) {
                    channel.style.backgroundColor = "white";
                }
                div.style.backgroundColor = "red";
            }
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
            div1.onmouseover = function() { div1.style.backgroundColor = "blue"; }
            div1.onmouseout = function() { localStorage.getItem('openedChannel') === div1.innerHTML ? div1.style.backgroundColor = "red" : div1.style.backgroundColor = "white"; }
            div1.onclick = function() {
                localStorage.setItem('openedChannel', div1.innerHTML);
                listOfChannels = div1.parentNode.childNodes;
                console.log(listOfChannels);
                for (channel of listOfChannels) {
                    channel.style.backgroundColor = "white";
                }
                div1.style.backgroundColor = "red";
            }
        }
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
