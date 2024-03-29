const $alerts = document.getElementById('alerts');


var connected = 0;
const socket = io();

//*********************Status Functions*********************
socket.on('connect', () => {


    //check for disconnected popup and remove if present
    var dcPopup = document.getElementById("disconnectedPopup");
    if (dcPopup != null) {
        dcPopup.remove();
    }

    //add connected popup
    document.getElementById('statusBar').appendChild(connectedPopUp());
});

socket.on('disconnect', () => {
    connected = 0;
    var connected = document.getElementById("connectedPopUp");

    //remove all alerts
    removeAllChildNodes(document.getElementById('alerts'));
    //removed connected indicator
    if (connected != null) {
        connected.remove();
    }
    //add disconnected indicator
    document.getElementById('statusBar').appendChild(dcPopUp());
});



//creates the disconnected status object
const dcPopUp = () => {
    var disconnectedPopUp = document.createElement('div');
    disconnectedPopUp.setAttribute("class", "disconnected");
    disconnectedPopUp.setAttribute("id", "disconnectedPopup");
    disconnectedPopUp.innerHTML = "Disconnected";
    return disconnectedPopUp;
}

//creates the connected status object
const connectedPopUp = () => {
    var connected = document.createElement('div');
    connected.setAttribute("class", "connected");
    connected.setAttribute("id", "connectedPopUp");
    connected.innerHTML = "Server Connected";
    return connected;
}

//replays audio element 'id' 60 seconds after it has ended
function loopaudio(id) {
    var audioControl = document.getElementById(id);
    audioControl.onended = function() {
        this.currentTime = 0;
        var delay = setTimeout(function() {
            var audioCheck = document.getElementById(id);
            if (audioCheck != null) {
                audioControl.play();
                clearTimeout(delay);
            }
        }, 90000);
    }
}


const listenSocket = io('/listener');
socket.on('connect', () => {});

function removeAllChildNodes(parent) {
    if (parent.firstChild != null) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }
}
//******************Cart Functions**********************

//receive ready on main socket
socket.on('cartReadySliderReady', () => {
    //add ready alert message and audio
    document.getElementById('alerts').appendChild(sirenAudio());
    document.getElementById('alerts').appendChild(cartAlert());
    //loop siren audio
    loopaudio("siren");
});

//fires when a cart is ready at connection time
socket.on('cartAlreadyReady', () => {
    //check to see if the alert already exists, if not, play it
    var check = document.getElementById("siren");
    if (check == null) {
        document.getElementById('alerts').appendChild(sirenAudio());
        document.getElementById('alerts').appendChild(cartAlert());
        loopaudio("siren");
    }
});

//fires when the ready slider is unchecked
socket.on('cartReadySliderTaken', () => {

    //remove alert siren and mesage
    var siren = document.getElementById("siren");
    siren.remove();
    var cartPopup = document.getElementById("cartPopup");
    cartPopup.remove();
});

//creates siren audio element
const sirenAudio = () => {
    const item = document.createElement('audio');
    item.setAttribute("src", "audio/tts.mp3");
    item.setAttribute("id", "siren");
    item.setAttribute("autoplay", "autoplay")
    return item;
};



//creates cart ready alert message
const cartAlert = () => {
    const item2 = document.createElement('div');
    item2.setAttribute("class", "cart-blink-bg");
    item2.setAttribute("id", "cartPopup");
    item2.innerHTML = "CART READY";
    return item2;
}




//************************Ticket Functions***************************

//receive ready on main socket
socket.on('ticketReadySliderReady', () => {
    //add ready alert message and audio
    document.getElementById('alerts').appendChild(ticketAudio());
    document.getElementById('alerts').appendChild(ticketAlert());
    //loop siren audio
    loopaudio("ticketAudio");
});

//fires when a cart is ready at connection time
socket.on('ticketAlreadyReady', () => {
    //check to see if the alert already exists, if not, play it
    var check = document.getElementById("ticketAudio");
    if (check == null) {
        document.getElementById('alerts').appendChild(ticketAudio());
        document.getElementById('alerts').appendChild(ticketAlert());
        loopaudio("ticketAudio");
    }
});

//fires when the ready slider is unchecked
socket.on('ticketReadySliderTaken', () => {

    //remove alert siren and mesage
    var siren = document.getElementById("ticketAudio");
    siren.remove();
    var ticketPopup = document.getElementById("ticketPopup");
    ticketPopup.remove();
});

//creates siren audio element
const ticketAudio = () => {
    const item = document.createElement('audio');
    item.setAttribute("src", "audio/listen.mp3");
    item.setAttribute("id", "ticketAudio");
    item.setAttribute("autoplay", "autoplay")
    return item;
};



//creates ticket ready alert message
const ticketAlert = () => {
    const item2 = document.createElement('div');
    item2.setAttribute("class", "ticket-blink-bg");
    item2.setAttribute("id", "ticketPopup");
    item2.innerHTML = "TICKET READY";
    return item2;
}



//************************Message Functions**************************

//fires when message is sent to the warehouse
socket.on('messageFromWarehouse', function(data) {
    console.log('receieved messageFromWarehouse');
    console.log(data);
    //add message to screen and play alert sound once
    document.getElementById('messages').appendChild(addMessage(data));
    messageAudio();

});

socket.on('currentMessages', function(data) {
    addMessages(data);
});

//adds single message from selector to warehouse screens
//receives array of objects where most recent message is in the last position
function addMessage(data) {
    var message = document.createElement('div');
    var date = new Date(data[data.length - 1].id);
    var hours = date.getHours() <= 12 ? date.getHours() : date.getHours() - 12;
    var timeOfDay = date.getHours() > 11 ? "PM" : "AM";
    message.setAttribute("class", "warehouseMessage");
    message.setAttribute("id", data[data.length - 1].id);
    message.innerHTML = data[data.length - 1].name + " (" + hours + ":" + date.getMinutes() + " " + timeOfDay + "): " + data[data.length - 1].message;
    message.innerHTML = data[data.length - 1].name + " (" + timeString(data[data.length - 1].id) + "): " + data[data.length - 1].message;
    return message;
}

//creates message alert audio and removes after 3 seconds
async function messageAudio() {
    const item = document.createElement('audio');
    item.setAttribute("src", "audio/metalgear.mp3");
    item.setAttribute("id", "messageSound");
    item.autoplay = true;
    document.getElementById('alerts').appendChild(item);
    await new Promise(r => setTimeout(r, 3000));
    document.getElementById('messageSound').remove();
};

listenSocket.on('currentMessages', function(data) {
    addMessages(data);
});


function addMessages(data) {
    removeAllChildNodes(document.getElementById('messages'));
    for (var i = 0; i < data.length; i++) {
        var message = document.createElement('div');
        message.setAttribute("class", "warehouseMessage");
        message.setAttribute("id", data[i].id);
        message.innerHTML = data[i].name + " (" + timeString(data[i].id) + "): " + data[i].message;
        document.getElementById('messages').appendChild(message);
    }
}

function timeString(data) {
    var date = new Date(data);
    var timeOfDay = date.getHours() > 11 ? "PM" : "AM";
    var hours;
    var minutes;
    if (date.getHours() < 13) {
        hours = date.getHours();
    } else {
        hours = (date.getHours() - 12);
    }
    if (date.getMinutes() > 9) {
        minutes = date.getMinutes();
    } else {
        minutes = "0" + date.getMinutes();
    }
    return hours + ":" + minutes + " " + timeOfDay;
}