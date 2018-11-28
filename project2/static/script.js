function checkLocalStorage(){
    if (!localStorage.getItem('username')){
        return false;
    } else {
        return true;
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

function displayMessages(nameOfChannel) {

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
            div.onclick = function() {                                  // I have no idea why this works
                localStorage.setItem('openedChannel', div.innerHTML);   // and the selectCahnnel function doesn't
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

function main(){
    var username;
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // setting event listeners

    document.querySelector("#sign-in-form").onsubmit = function() {
        username = document.querySelector("#username").value;
        document.querySelector("#sign-in").style.display = "none";
        localStorage.setItem('username', username);
        document.querySelector("#user").innerHTML = localStorage.getItem('username');
        document.querySelector("#main-row").style.pointerEvents = "auto";
        displayYourChannels();
        return false;
    }

    document.querySelector("#createChannelButton").onclick = function() {
        document.querySelector("#createChannelDiv").style.display = "block";
        document.querySelector("#main-row").style.pointerEvents = "none";
    }

    socket.on('connect', function() {
        document.querySelector("#newChannelSubmit").onclick = function() {
            const channelName = document.querySelector("#channelName").value;
            const channelCreator = localStorage.getItem('username');
            document.querySelector("#createChannelDiv").style.display = "none";
            document.querySelector("#main-row").style.pointerEvents = "auto";
            socket.emit('create channel', {'channelName': channelName, 'channelCreator': channelCreator});
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
                // TODO: implement message displaying function
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
                // TODO: implement message displaying function
            }
        }
    })

    // implementing main function

    if (checkLocalStorage()){
        document.querySelector("#user").innerHTML = localStorage.getItem('username');
        displayYourChannels();
    } else {
        document.querySelector("#sign-in").style.display = "block";
        document.querySelector("#main-row").style.pointerEvents = "none";
    }

    displayAllChannels();
}

document.addEventListener('DOMContentLoaded', main);
