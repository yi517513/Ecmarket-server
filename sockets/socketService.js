const { Server } = require("socket.io");

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      credentials: true,
      origin: "http://localhost:4000",
      methods: ["GET", "POST"],
    },
  });

  return io;
};

module.exports = initializeSocket;
