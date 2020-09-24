var path = require('path');

var express = require('express');
var app = express();

var dir = path.join(__dirname, '/');

app.use(express.static(dir));
var server = require('http').createServer(app)
const io = require('socket.io')(server);


io.on('connect', socket => {
  console.log('connect');
  socket.on('ready', function (data) {
    io.emit('ready');
  });
  socket.on('taken', function (data) {
    io.emit('taken');

  });
  socket.on('listenerPing', function (data) {
    io.emit('listenerPing');
  });
});


server.listen(3000, () => {
  console.log('go to http://localhost:3000');
});