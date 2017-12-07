
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
  // console.log('sock',socket)
  socket.emit('conn', { msg: `<li>connection success, welcome you!!!</li>`, countId:countId, socketid:socket.id});
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
 // 给指定client发消息，监听send
 socket.on('sixin',function(msg){
  var id=msg.split(',')[0]
  var data=msg.split(',')[1]
  console.log(msg)
  console.log('id', id)
  // 存在此用户
  if(io.sockets.connected[id]){
    if(id == socket.id){
      socket.emit("message",{msg: `<li style="color:orange;">来自自己的私信 <br\> ${data}</li>`});
      return;
    }
    io.sockets.connected[id].emit("message",{msg: `<li style="color:pink;">来自${socket.id} 私信 <br\> ${data}</li>`});

  }else{
    socket.emit('r-msg', { msg: `<li style="color:blue;">你要私信的对象不在哟！！！</li>`});
  }

 })

});
