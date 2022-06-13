const app = require('express')();
const { Server } = require('socket.io');
const {
  getActiveUser,
  exitRoom,
  newUser,
  getIndividualRoomUsers
} = require('./helpers/userHelper');

async function server() {
  const http = require('http').createServer(app);
  const io = new Server(http, { transports: ['websocket'] });
  const roomName = 'dogfoot';
  io.on('connection', (socket) => {
    socket.on('join', ({ username, name, room }) => {
      console.log('join');
      const user = newUser(socket.id, username, name, room);
      socket.join(roomName);
      socket.to(roomName).emit('joined');
      // console.log(user);
    });
    socket.on('offer', (offer) => {
      // socket.to(roomName).emit('offer', offer);
      const user = getActiveUser(socket.id);
      if (user) {
        console.log('offer');
        socket.to(roomName).emit('offer', offer);
      }
    });
    socket.on('answer', (answer) => {
      // socket.to(roomName).emit('answer', answer);
      const user = getActiveUser(socket.id);
      if (user) {
        console.log('answer');
        socket.to(roomName).emit('answer', answer);
      }
    });
    socket.on('ice', (ice) => {
      // socket.to(roomName).emit('ice', ice);
      const user = getActiveUser(socket.id);
      if (user) {
        console.log('ice');
        socket.to(roomName).emit('ice', ice);
      }
    });
    // socket.on('disconnect', () => {
    //   const user = exitRoom(socket.id);
    // });
  });
  http.listen(3000, () => console.log('server open !!'));
}

server();

// async function server() {
//   const http = require('http').createServer(app);
//   const io = new Server(http, { transports: ['websocket'] });
//   const roomName = 'dogfoot';
//   io.on('connection', (socket) => {
//     socket.on('join', () => {
//       console.log('ada yg join room id ' + socket.id);
//       socket.join(roomName);
//       socket.to(roomName).emit('joined');
//     });
//     socket.on('offer', (offer) => {
//       socket.to(roomName).emit('offer', offer);
//     });
//     socket.on('answer', (answer) => {
//       socket.to(roomName).emit('answer', answer);
//     });
//     socket.on('ice', (ice) => {
//       socket.to(roomName).emit('ice', ice);
//     });
//     socket.on('disconnect', () => {
//       console.log('ada yg leave room id ' + socket.id);
//       // io.to(roomName).emit('roomUsers', {
//       //   room: user.room,
//       //   users: getIndividualRoomUsers(user.room)
//       // });
//     });
//   });
//   http.listen(3000, () => console.log('server open !!'));
// }