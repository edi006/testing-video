const express = require("express");
const app = express();
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
const url = require("url");
app.set("view engine", "ejs");
const io = require("socket.io")(server, {
  cors: {
    origin: '*'
  },
});
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.use("/peerjs", peerServer);
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/room", (req, res) => {
  var q = url.parse(req.url, true);
  var room = q.query.room;
  var user = q.query.user;
  res.render("room", { room: req.params.room, user: req.params.fruitColor });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId, userName) => {
    console.log(socket.id);
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);
    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message, userName);
    });
    socket.on('disconnect', () => {
      console.log(socket.id);
    });
  });
});

server.listen(process.env.PORT || 3000);