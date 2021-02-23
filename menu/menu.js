

const socket = io();
//Status Bar Functions
socket.on('connect', () => {
    var dcPopup = document.getElementById("disconnectedPopup");
    if (dcPopup != null) {
        dcPopup.remove();
    }
    document.getElementById('statusBar').appendChild(connectedPopUp());

});

socket.on('disconnect', () => {
    var connected = document.getElementById("connectedPopUp");
    var listenerConnected = document.getElementById("listenerConnectedPopUp")
    if (connected != null) {
        connected.remove();
        console.log("removed connected");
    }
    if (listenerConnected != null) {
        listenerConnected.remove();
    }
    document.getElementById('statusBar').appendChild(dcPopUp());
    removeAllChildNodes(document.getElementById('allMessages'));
});

socket.on('listenerConnected', () => {
    var listenerOn = document.getElementById('listenerConnectedPopUp');
    var noListeners = document.getElementById('noListenerPopup');
    if (noListeners != null) {
        noListeners.remove();
        console.log("removed no listener prompt");
    }
    if (listenerOn == null) {
        document.getElementById('statusBar').appendChild(listenerPopUp());
    }
});

socket.on('noListeners', () => {
    console.log('received noListeners');
    var listenerOn = document.getElementById('listenerConnectedPopUp');
    if (listenerOn != null) {
        listenerOn.remove();
    }
    if (document.getElementById('noListenerPopup') == null) {
        document.getElementById('statusBar').appendChild(noListener());
    }
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

function removeAllChildNodes(parent) {
    if (parent.firstChild != null) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }
}

//Cart Related Functions
socket.on('cartReadySliderReady', () => {
    var slider = document.getElementById('cartReadySlider');
    if (slider.checked == false) {
        slider.checked = true;
        console.log('slider checked');
    }
    console.log('received ready');
});

socket.on('cartAlreadyReady', () => {
    var slider = document.getElementById('cartReadySlider');
    if (slider.checked == false) {
        slider.checked = true;
        console.log('slider checked');
    }
    console.log('received alreadyready');
});

socket.on('cartReadySliderTaken', () => {
    var slider = document.getElementById('cartReadySlider');
    if (slider.checked) {
        slider.checked = false;
        console.log('slider unchecked');
    }
    console.log('received taken');

});

function switchToggled(id) {
    // Get the checkbox
    var checkBox = document.getElementById(id);
    // If the checkbox is checked, display the output text
    if (checkBox.checked == true) {
        socket.emit(id + 'Ready');
    } else {
        socket.emit(id + 'Taken');
    }

}

//Pick Ticket Functions

socket.on('ticketReadySliderReady', () => {
    var slider = document.getElementById('ticketReadySlider');
    if (slider.checked == false) {
        slider.checked = true;
        console.log('slider checked');
    }
    console.log('received ready');
});

socket.on('ticketAlreadyReady', () => {
    var slider = document.getElementById('ticketReadySlider');
    if (slider.checked == false) {
        slider.checked = true;
        console.log('slider checked');
    }
    console.log('received alreadyready');
});

socket.on('ticketReadySliderTaken', () => {
    var slider = document.getElementById('ticketReadySlider');
    if (slider.checked) {
        slider.checked = false;
        console.log('slider unchecked');
    }
    console.log('received taken');

});



//Message Functions

socket.on('messageFromWarehouse', function (data) {
    console.log('receieved messageFromWarehouse');
    console.log(data);
    addMessages(data);

});

socket.on('currentMessages', function (data) {
    addMessages(data);
    console.log('added current messages');
    console.log(data);
    if (data.length == 0) {
        document.getElementById('allMessages').innerHTML = 'No Messages';
        console.log('length of 0')
    }
})

$('form[name="messagePrompt"]').submit(function (e) {
    e.preventDefault();

    var data = {
        name: $('[name="messageName"]').val(),
        message: $('[name="warehouseMessage"]').val(),
        id: Date.now()
    };
    console.log('message function executed');
    socket.emit('message to warehouse', data);
});

function addMessages(data) {
    removeAllChildNodes(document.getElementById('allMessages'));
    for (var i = 0; i < data.length; i++) {

        var message = document.createElement('label');
        message.setAttribute("class", "warehouseMessage");
        message.setAttribute("id", "message" + data[i].id);
        message.innerHTML = data[i].name + " (" + timeString(data[i].id) + "): " + data[i].message;
        document.getElementById('allMessages').appendChild(message);
        var removeBox = document.createElement('input');
        removeBox.setAttribute("type", "button");
        removeBox.setAttribute("id", "button" + i);
        removeBox.setAttribute("class", "removeButton");
        removeBox.setAttribute("value", "Remove");
        removeBox.setAttribute("onclick", "removeMessage(" + i + ")");
        document.getElementById('allMessages').appendChild(removeBox);
        document.getElementById('allMessages').appendChild(document.createElement("br"));
    }
}

function timeString(data) {
    var date = new Date(data);
    var timeOfDay = date.getHours() > 11 ? "PM" : "AM";
    var hours;
    var minutes;
    if (date.getHours() < 13) {
        hours = date.getHours();
    }
    else {
        hours = (date.getHours() - 12);
    }
    if (date.getMinutes() > 9) {
        minutes = date.getMinutes();
    }
    else {
        minutes = "0" + date.getMinutes();
    }
    return hours + ":" + minutes + " " + timeOfDay;
}

function removeMessage(i) {
    socket.emit('removeMessage', i);
    console.log('remove message ' + i);
}