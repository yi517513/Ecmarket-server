const { Server } = require("socket.io");

class SocketService {
  constructor() {
    this.ioInstance = null;
    this.socketUsers = new Map();
    this.userSockets = new Map();
  }

  initialize(server) {
    if (!this.ioInstance) {
      console.log("開始實例");
      this.ioInstance = new Server(server, {
        cors: {
          credentials: true,
          origin: "http://localhost:4000",
          methods: ["GET", "POST"],
        },
      });
    }
    return this.ioInstance;
  }

  getInstance() {
    if (!this.ioInstance) {
      throw new Error("Socket.io 未實例");
    }
    return this.ioInstance;
  }

  // 儲存userId與Socket
  saveSocketUser(socketId, userId, username, lastLogoutTime) {
    try {
      // 將 socket.id 映射到用戶資料
      this.socketUsers.set(socketId, { userId, username, lastLogoutTime });
      // 將 userId 映射到單一的 socket.id
      this.userSockets.set(userId, socketId);
    } catch (error) {
      console.error(
        `保存用戶資料失敗 - socket.id: ${socketId}, 原因: ${error.message}`
      );
      throw new Error("保存用戶資料失敗");
    }
  }

  // 透過socket.id獲取用戶資料
  getUser(socketId) {
    return this.socketUsers.get(socketId) || null;
  }

  // 透過userId獲取用戶的socket.id
  getSockets(userId) {
    return this.userSockets.get(userId) || null;
  }

  // 移除用戶信息（斷開連線時清理）
  removeUser(socketId) {
    const user = this.socketUsers.get(socketId);
    if (user) {
      this.userSockets.delete(user.userId);
    }
    this.socketUsers.delete(socketId);
  }
}

const socketService = new SocketService();
module.exports = socketService;
