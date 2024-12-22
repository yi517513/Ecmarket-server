const { Server } = require("socket.io");

let ioInstance = null;

const initializeSocket = (server) => {
  console.log("開始實例");
  if (!ioInstance) {
    ioInstance = new Server(server, {
      cors: {
        credentials: true,
        origin: "http://localhost:4000",
        methods: ["GET", "POST"],
      },
    });
  }

  return ioInstance;
};

const getSocketInstance = () => {
  if (!ioInstance) {
    throw new Error("Socket.io 未實例");
  }
  return ioInstance;
};

module.exports = { initializeSocket, getSocketInstance };
