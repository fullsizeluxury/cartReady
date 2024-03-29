var path = require('path');
var fs = require('fs');
var express = require('express');
var app = express();
var messages = [];

var dir = path.join(__dirname, '/');
var listeners = 0;
var cartReady = 0;
var ticketReady = 0;

app.use(express.static(dir));
var server = require('http').createServer(app)

//main socket
const io = require('socket.io')(server);

//*************************Status Functions****************************
io.on('connect', socket => {
  var clientIp = socket.request.connection.remoteAddress;
  console.log('connect');
  console.log(clientIp);

  if (listeners >= 1) {
    io.emit('listenerConnected');
  }
  if (listeners == 0) {
    io.emit('noListeners');
  }
  if (cartReady == 1) {
    io.emit('cartAlreadyReady');
  }
  if (messages.length != 0) {
    console.log('sendingCurrentMessages');
    io.emit('currentMessages', messages)
  }
  if (ticketReady == 1) {
    io.emit('ticketAlreadyReady');
  }


  //***********************Cart Functions****************************
  socket.on('cartReadySliderReady', function (data) {
    io.emit('cartReadySliderReady');
    cartReady = 1;
    console.log('cartReady');
  });

  socket.on('cartReadySliderTaken', function (data) {
    io.emit('cartReadySliderTaken');
    cartReady = 0;
    console.log('cart taken');
  });

  //**********************Ticket Functions*************************

  socket.on('ticketReadySliderReady', function (data) {
    io.emit('ticketReadySliderReady');
    ticketReady = 1;
    console.log('ticketReady');
  });

  socket.on('ticketReadySliderTaken', function (data) {
    io.emit('ticketReadySliderTaken');
    ticketReady = 0;
    console.log('ticket taken');
  });


  //*************************Message Functions*************************
  socket.on('message to warehouse', function (data) {
    messages.push(data);
    //console.log(messages);
    io.emit('messageFromWarehouse', messages);
    console.log('emitted message from warehouse');
    fs.appendFileSync('messagelog.txt', Date() + JSON.stringify(data) + " " + clientIp + "\r");

  });

  socket.on('removeMessage', function (data) {
    messages.splice(data, 1);
    io.emit('currentMessages', messages);

  });


});

//listener socket
const listener = io.of('/listener');

listener.on('connect', socket => {
  if (listeners == 0) {
    io.emit('listenerConnected');
  }
  console.log('listener connected ' + ++listeners);

  socket.on('disconnect', function () {
    console.log('listener disconnected, new listener count is ' + --listeners);
    if (listeners == 0) {
      io.emit('noListeners');
    }
  });
});


server.listen(3000, () => {
  console.log('go to http://localhost:3000');
});