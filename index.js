/* const content = require('fs').readFileSync(__dirname + '/index.html', 'utf8');

const httpServer = require('http').createServer((req, res) => {
  // serve the index.html file
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', Buffer.byteLength(content));
  res.end(content);
});

*/
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

/*
io.on('message', (data => {
  console.log(data);
  if(data == 'ready') {
    socket.emit('ready');
  }
  else if (data == 'taken') {
    socket.emit('taken');
  }
}));*/

/*io.on('ready', socket => {
  console.log(socket);
  socket.emit('ready');
});

io.on('taken', socket => {
  console.log(socket);
  socket.emit('taken');
}); */

server.listen(3000, () => {
  console.log('go to http://localhost:3000');
});