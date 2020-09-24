const socket = io();

socket.on('connect', () => {
    var dcPopup = document.getElementById("disconnectedPopup");
    if (dcPopup != null) {
        dcPopup.remove();
    }
    document.getElementById('events').appendChild(connectedPopUp());

});


socket.on('disconnect', () => {
    var connected = document.getElementById("connectedPopUp");
    if (connected != null) {
        connected.remove();
    }
    document.getElementById('events').appendChild(dcPopUp());
});
socket.on('ready', () => {
    var slider = document.getElementById('readySlider');
    slider.setAttribute("checked", "checked")
});
socket.on('listenerConnected', () => {
    var listenerOn = document.getElementById('listenerConnectedPopup');
    var noListeners = document.getElementById('noListenerPopup');
    if (noListeners != null) {
        noListeners.remove();
    }
    if (listenerOn == null) {
    document.getElementById('events').appendChild(listenerPopUp());            
    }
});

socket.on('noListeners', () => {
    var listenerOn = document.getElementById('listenerConnectedPopUp');
    if (listenerOn != null) {
    listenerOn.remove();           
    }
    document.getElementById('events').appendChild(noListener());

});



socket.on('taken', () => {
    var slider = document.getElementById('readySlider');
    slider.removeAttribute("checked", "checked");

});
const dcPopUp = () => {
    var disconnectedPopUp = document.createElement('div');
    disconnectedPopUp.setAttribute("class", "disconnected");
    disconnectedPopUp.setAttribute("id", "disconnectedPopup");
    disconnectedPopUp.innerHTML = "Server Disconnected";
    return disconnectedPopUp;
}
const listenerPopUp = () => {
    var connected = document.createElement('div');
    connected.setAttribute("class", "listenerConnected");
    connected.setAttribute("id", "listenerConnectedPopUp");
    connected.innerHTML = "Listener Connected";
    return connected;
}
const noListener = () => {
    var connected = document.createElement('div');
    connected.setAttribute("class", "noListeners");
    connected.setAttribute("id", "noListenerPopup");
    connected.innerHTML = "No Listeners Connected";
    return connected;
}
const connectedPopUp = () => {
    var connected = document.createElement('div');
    connected.setAttribute("class", "connected");
    connected.setAttribute("id", "connectedPopUp");
    connected.innerHTML = "Server Connected";
    return connected;
}
function myFunction() {
    // Get the checkbox
    var checkBox = document.getElementById("readySlider");
    // If the checkbox is checked, display the output text
    if (checkBox.checked == true) {
        socket.emit('ready');
    } else {
        socket.emit('taken');;
    }

}