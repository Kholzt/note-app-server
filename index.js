// const express = require("express");
// const app = express();
// const PORT = 4000;
// const cors = require("cors");
// const http = require("http");
// const { Server } = require("socket.io");

// app.use(cors());
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     method: ["GET", "POST"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log(`Client ${socket.id} connected`);

//   socket.on("privateRoom", (userId) => {
//     socket.join(userId);
//     console.log("join room" + userId);
//   });

//   socket.on("addNote", (userId) => {
//     socket.broadcast.to(userId).emit("getNote", "Message from server");
//   });
//   socket.on("deleteNote", (userId) => {
//     socket.broadcast.to(userId).emit("getNote");
//   });

//   socket.on("disconnect", () => {
//     console.log(`Client ${socket.id} disconnected`);
//   });
// });

// server.listen(PORT, () => {
//   console.log(`Server listening on ${PORT}`);
// });
const express = require("express");
const app = express();
const PORT = 4000;
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

app.use(
  cors({
    origin: "*", // Consider restricting this in production
    methods: ["GET", "POST"],
  })
);

const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*", // Consider restricting this in production
//     methods: ["GET", "POST"],
//   },
// });

const io = new Server(server, {
  path: "/socket",
  wsEngine: ["ws", "wss"],
  transports: ["websocket", "polling"],
  cors: {
    origin: "*", // Consider restricting this in production
    methods: ["GET", "POST"],
  },
  allowEIO3: true,
});
io.on("connection", (socket) => {
  console.log(`Client ${socket.id} connected`);

  socket.on("privateRoom", (userId) => {
    socket.join(userId);
    console.log(`Client ${socket.id} joined room ${userId}`);
  });

  socket.on("addNote", (userId) => {
    try {
      socket.broadcast.to(userId).emit("getNote", "Message from server");
    } catch (error) {
      console.error("Error emitting addNote:", error);
    }
  });

  socket.on("deleteNote", (userId) => {
    try {
      socket.broadcast.to(userId).emit("getNote");
    } catch (error) {
      console.error("Error emitting deleteNote:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} disconnected`);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
