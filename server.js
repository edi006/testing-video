// const express = require("express");
// const app = express();
// const server = require("http").Server(app);
// const { v4: uuidv4 } = require("uuid");
// app.set("view engine", "ejs");
// const io = require("socket.io")(server, {
//   transports: ['websocket'],
//   cors: {
//     origin: '*'
//   },
// });
// const { ExpressPeerServer } = require("peer");
// const peerServer = ExpressPeerServer(server, {
//   debug: true,
//   transports: ['websocket'],
//   cors: {
//     origin: '*'
//   },
// });

// app.use("/peerjs", peerServer);
// app.use(express.static("public"));

// app.get("/", (req, res) => {
//   res.redirect(`/${uuidv4()}`);
// });

// app.get("/:room", (req, res) => {
//   res.render("room", { roomId: req.params.room });
// });

// io.on("connection", (socket) => {
//   socket.on("join-room", (roomId, userId, userName) => {
//     socket.join(roomId);
//     socket.to(roomId).broadcast.emit("user-connected", userId);
//     socket.on("message", (message) => {
//       io.to(roomId).emit("createMessage", message, userName);
//     });
//   });
// });

// server.listen(process.env.PORT || 3000);


const app = require('express')();
const {Server} = require('socket.io');

async function server(){
    const http = require('http').createServer(app);
    const io = new Server(http, {transports: ['websocket']});
    const roomName = 'dogfoot';
    io.on('connection', (socket) => {
       socket.on('join', () =>{
         socket.join(roomName);
         socket.to(roomName).emit('joined');
       });
       socket.on('offer', (offer) => {
           socket.to(roomName).emit('offer', offer);
        });
        socket.on('answer', (answer) => {
            socket.to(roomName).emit('answer', answer);
        });
        socket.on('ice', (ice) => {
            socket.to(roomName).emit('ice', ice);
        });

    });
    http.listen(process.env.PORT || 3000, () => console.log('server open !!'));
}

server();