
// 参考地址 http://blog.fens.me/nodejs-websocket/
var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);
  var express=require('express');

server.listen(3000);

app.use(express.static('public'));

var countId=0;

io.sockets.on('connection', function (socket) {
  countId++
  socket.emit('conn', { msg: `<li>connection success, welcome you!!!</li>`, countId:countId});
  console.log('socketid', socket.id)
  socket.broadcast.emit('conn', { msg: `<li style="color:blue;">ID:${socket.id} are comming</li>`, countId:countId });
  socket.on('s-msg',function(data){
      socket.emit('r-msg', { msg: `<li>${data}</li>`});
      socket.broadcast.emit('r-msg', { msg: `<li style="color:blue;">${socket.id} said <br\> ${data}</li>`});
  })
  socket.on('disconnect', (reason) => {
    countId--;
   socket.broadcast.emit('leave', { msg: `ID:${socket.id} are leaving`, countId:countId });
 });

});
