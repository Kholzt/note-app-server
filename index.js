const express = require("express");
const app = express();
const PORT = 4000;
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:9000",
    method: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log(`Client ${socket.id} connected`);

  socket.on("privateRoom", (userId) => {
    socket.join(userId);
    console.log("join room" + userId);
  });

  socket.on("addNote", (userId) => {
    socket.broadcast.to(userId).emit("getNote", "Message from server");
  });
  socket.on("deleteNote", (userId) => {
    socket.broadcast.to(userId).emit("getNote");
  });

  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} disconnected`);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
