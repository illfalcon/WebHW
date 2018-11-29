function checkLocalStorage(){
    if (!localStorage.getItem('username')){
        return false;
    } else {
        return true;
    }
}

function checkLocalStorageChannel() {
    if (localStorage.getItem('openedChannel')){
        return true;
    } else {
        return false;
    }
}

// function selectChannel(div) {
//     localStorage.setItem('openedChannel', div.innerHTML);
//     listOfChannels = div.parentNode.childNodes;
//     console.log(listOfChannels);
//     for (channel of listOfChannels) {
//         channel.style.backgroundColor = "white";
//     }
//     div.style.backgroundColor = "red";
//     // TODO: implement message displaying function
// }

function displayMessages() {
    document.querySelector('#messagesArea').innerHTML = '';
    const request = new XMLHttpRequest();
    request.open('POST', '/display_messages');

    request.onload = function() {
        const data = JSON.parse(request.responseText);
        for (message of data.messages) {
            let outerDiv = document.createElement('div');
            if (message.sender === localStorage.getItem('username')) {
                outerDiv.classList.add('message-orange');
            } else {
                outerDiv.classList.add('message-blue');
            }
            let senderName = document.createElement('h5');
            senderName.innerHTML = message.sender;
            let messageText = document.createElement('p');
            messageText.classList.add('message-content');
            messageText.innerHTML = message.text;
            outerDiv.appendChild(senderName);
            outerDiv.appendChild(messageText);
            document.querySelector('#messagesArea').appendChild(outerDiv);
        }
        document.querySelector('#messagesArea').lastChild.scrollIntoView({behavior: "instant", block: "end", inline: "nearest"});
    }

    const form = new FormData();
    let nameOfChannel = localStorage.getItem('openedChannel');
    form.append('channelName', nameOfChannel);
    request.send(form);
    return false;
}

function displayYourChannels() {
    document.querySelector("#yourChannelsList").innerHTML = '';
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
                for (channel of listOfChannels) {
                    channel.style.backgroundColor = "white";
                }
                div.style.backgroundColor = "red";
                displayMessages();
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
    document.querySelector("#allChannelsList").innerHTML = '';
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
            div.onclick = function() {                                  // I have no idea why this works
                localStorage.setItem('openedChannel', div.innerHTML);   // and the selectCahnnel function doesn't
                listOfChannels = div.parentNode.childNodes;
                for (channel of listOfChannels) {
                    channel.style.backgroundColor = "white";
                }
                div.style.backgroundColor = "red";
                displayMessages();
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
        document.querySelector("#sign-in-row").style.display = "none";
        localStorage.setItem('username', username);
        document.querySelector("#user").innerHTML = localStorage.getItem('username');
        document.querySelector("#main-row").style.pointerEvents = "auto";
        displayYourChannels();
        displayAllChannels();
        return false;
    }

    document.querySelector("#createChannelButton").onclick = function() {
        document.querySelector("#create-channel-row").style.display = "block";
        document.querySelector("#main-row").style.pointerEvents = "none";
    }

    socket.on('connect', function() {
        document.querySelector("#newChannelSubmit").onclick = function() {
            const channelName = document.querySelector("#channelName").value;
            const channelCreator = localStorage.getItem('username');
            document.querySelector("#create-channel-row").style.display = "none";
            document.querySelector("#main-row").style.pointerEvents = "auto";
            socket.emit('create channel', {'channelName': channelName, 'channelCreator': channelCreator});
        }

        document.querySelector("#sendMessageButton").onclick = function() {
            const channelName = localStorage.getItem('openedChannel');
            const messageText = document.querySelector('#messageTextArea').value;
            const messageSender = localStorage.getItem('username');
            socket.emit('message sent', {'channelName': channelName, 'messageText': messageText, 'messageSender': messageSender});
        }
    })

    socket.on('announce message', function(message){
        if (localStorage.getItem('openedChannel') === message.channel){
            let outerDiv = document.createElement('div');
            if (message.sender === localStorage.getItem('username')) {                outerDiv.classList.add('message-orange')
            } else {
                outerDiv.classList.add('message-blue')
            }
            let senderName = document.createElement('h5');
            senderName.innerHTML = message.sender;
            let messageText = document.createElement('p');
            messageText.classList.add('message-content');
            messageText.innerHTML = message.text;
            outerDiv.appendChild(senderName);
            outerDiv.appendChild(messageText);
            document.querySelector('#messagesArea').appendChild(outerDiv);
            outerDiv.scrollIntoView({behavior: "instant", block: "end", inline: "nearest"});
        }
    })

    socket.on('announce channel', function(data) {
        let div = document.createElement("div");
        div.innerHTML = data.channelName;

        yourChannels = document.querySelector('#yourChannelsList');
        allChannels = document.querySelector('#allChannelsList');

        if (localStorage['username'] === data.channelCreator) {
            yourChannels.appendChild(div);
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
                displayMessages();
            }
        } else {
            allChannels.appendChild(div);
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
                displayMessages();
            }
        }
    })

    // implementing main function

    if (checkLocalStorage()){
        document.querySelector("#user").innerHTML = localStorage.getItem('username');
        displayYourChannels();
        displayAllChannels();
    } else {
        document.querySelector("#sign-in-row").style.display = "block";
        document.querySelector("#main-row").style.pointerEvents = "none";
    }

    if (checkLocalStorageChannel()) {
        displayMessages();
    }

}

document.addEventListener('DOMContentLoaded', main);
