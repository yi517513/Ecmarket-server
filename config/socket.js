const { Server } = require("socket.io");

class Socket {
  static io = null;

  static initialize(server) {
    if (!Socket.io) {
      Socket.io = new Server(server, {
        cors: {
          credentials: true,
          origin: ["http://localhost:4000", "http://localhost:5173"],
          methods: ["GET", "POST"],
        },
      });
    }

    return Socket.io;
  }

  static getInstance() {
    if (!Socket.io) {
      throw new Error("Socket 尚未連線，請先呼叫 Socket.connect()");
    }
    return Socket.io;
  }
}

module.exports = Socket;
