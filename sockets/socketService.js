const { Server } = require("socket.io");

let io;

const initializeSocket = (server) => {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });
  }
  return io;
};

const sendMessageToRoom = (eventName, roomId, message) => {
  // console.log(roomId);
  if (io) {
    io.to(`room_${roomId}`).emit(eventName, message);
  } else {
    console.error("Socket.io is not initialized.");
  }
};

module.exports = { initializeSocket, sendMessageToRoom };
