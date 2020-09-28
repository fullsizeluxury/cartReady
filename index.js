var path = require('path');

var express = require('express');
var app = express();

var dir = path.join(__dirname, '/');
var listeners = 0;
var cartReady = 0;

app.use(express.static(dir));
var server = require('http').createServer(app)

//main socket
const io = require('socket.io')(server);


io.on('connect', socket => {
  console.log('connect');
  if(listeners >= 1) {
    io.emit('listenerConnected');
  }
  if (listeners == 0) {
    io.emit('noListeners');
  }
  if (cartReady == 1) {
    io.emit('alreadyReady');
  }

  socket.on('ready', function (data) {
    io.emit('ready');
    cartReady=1;
    console.log('cartReady');
  });

  socket.on('taken', function (data) {
    io.emit('taken');
    cartReady=0;
    console.log('cart taken');
  });
  socket.on('message to warehouse', function(data) {
    io.emit('messageFromWarehouse', data);
    console.log('emitted message from warehouse');
  });


});

//listener socket
const listener = io.of('/listener');

listener.on('connect', socket => {
  if (listeners == 0) {
    io.emit('listenerConnected');
  }
  console.log('listener connected ' + ++listeners);

  socket.on('disconnect', function() {
    console.log('listener disconnected, new listener count is ' + --listeners);
    if (listeners == 0) {
      io.emit('noListeners');
    }
  });
});


server.listen(3000, () => {
  console.log('go to http://localhost:3000');
});