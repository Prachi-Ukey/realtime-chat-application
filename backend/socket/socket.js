const { Server } = require("socket.io");

let io;

const onlineUsers = {};

const initSocket = (server) => {

  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true
    }
  });

  io.on("connection", (socket) => {

    console.log("Connected:", socket.id);

    socket.on("join", (userId) => {

      socket.userId = userId;

      onlineUsers[userId] = socket.id;

      console.log(userId, "joined");
      console.log("ONLINE USERS", onlineUsers);

      // send online users to everyone
      io.emit("onlineUsers", Object.keys(onlineUsers));

    });

    socket.on("disconnect", () => {

      console.log("Disconnected");

      if (socket.userId) {
        delete onlineUsers[socket.userId];
      }

      console.log("ONLINE USERS", onlineUsers);

      io.emit("onlineUsers", Object.keys(onlineUsers));

    });

  });

};

const getIO = () => io;

const getOnlineUsers = () => onlineUsers;

module.exports = {
  initSocket,
  getIO,
  getOnlineUsers
};