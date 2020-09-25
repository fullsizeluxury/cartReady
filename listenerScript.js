const $events = document.getElementById('events');



const socket = io();


socket.on('connect', () => {
    var dcPopup = document.getElementById("disconnectedPopup");
    if (dcPopup != null) {
        dcPopup.remove();
    }
    document.getElementById('events').appendChild(connectedPopUp());
});

socket.on('ready', () => {
    document.getElementById('events').appendChild(sirenAudio());
    document.getElementById('events').appendChild(readyAlert());
    loopaudio();
});

socket.on('taken', () => {
    var siren = document.getElementById("siren");
    siren.remove();
    var cartPopup = document.getElementById("popup");
    cartPopup.remove();
});

socket.on('disconnect', () => {
    var siren = document.getElementById("siren");
    var cartPopup = document.getElementById("popup");
    var connected = document.getElementById("connectedPopUp");
    if (siren != null) {
        siren.remove();
        cartPopup.remove();
    }
    if (connected != null) {
        connected.remove();
    }
    document.getElementById('events').appendChild(dcPopUp());
});
const dcPopUp = () => {
    var disconnectedPopUp = document.createElement('div');
    disconnectedPopUp.setAttribute("class", "disconnected");
    disconnectedPopUp.setAttribute("id", "disconnectedPopup");
    disconnectedPopUp.innerHTML = "Disconnected";
    return disconnectedPopUp;
}

const connectedPopUp = () => {
    var connected = document.createElement('div');
    connected.setAttribute("class", "connected");
    connected.setAttribute("id", "connectedPopUp");
    connected.innerHTML = "Server Connected";
    return connected;
}

function loopaudio() {
    var audioControl = document.getElementById("siren");
    audioControl.onended = function () {
        this.currentTime = 0;
        var delay = setTimeout(function () {
            var audioCheck = document.getElementById("siren");
            if (audioCheck != null) {
                audioControl.play();
                clearTimeout(delay);
            }
        }, 60000);
    }
}

const sirenAudio = () => {
    const item = document.createElement('audio');
    item.setAttribute("src", "audio/purge_siren.mp3");
    item.setAttribute("id", "siren");
    item.setAttribute("autoplay", "autoplay")
    return item;
};
const readyAlert = () => {
    const item2 = document.createElement('div');
    item2.setAttribute("class", "blink-bg");
    item2.setAttribute("id", "popup");
    item2.innerHTML = "CART READY";
    return item2;
}

const listenSocket = io('/listener');
socket.on('connect', () => {
});


function sendReady() {
    socket.emit('ready');
};
function sendTaken() {
    socket.emit('taken');
};