const { cookieParser } = require("../utils/cookieHelper");
const { decodeToken } = require("../utils/tokenHelper");

class UserManager {
  constructor() {
    this.socketUsers = new Map();
    this.userSockets = new Map();
  }

  getAllUser() {
    console.log(this.userSockets);
    return this.userSockets;
  }

  // decode refresh token 並獲取 userId與username
  verifyToken(socket) {
    try {
      const cookie = cookieParser(socket.handshake.headers.cookie);
      const payload = decodeToken(cookie["refreshToken"], "refresh");

      if (!payload || !payload.id) {
        throw new Error("無效的Token!");
      }
      const { id: userId, username } = payload;

      return { userId, username };
    } catch (error) {
      throw new Error("驗證失敗: " + error.message);
    }
  }

  // 儲存userId與Socket
  saveUserAndSocket(socket) {
    try {
      const { userId, username } = this.verifyToken(socket);

      // 將 socket.id 映射到用戶資料
      this.socketUsers.set(socket.id, { userId, username });
      // 將 userId 映射到單一的 socket.id
      this.userSockets.set(userId, socket.id);
    } catch (error) {
      console.error(
        `保存用戶資料失敗 - socket.id: ${socket.id}, 原因: ${error.message}`
      );
      throw new Error("保存用戶資料失敗");
    }
  }

  // 透過socket.id獲取用戶資料
  getUser(socketId) {
    return this.socketUsers.get(socketId);
  }

  // 透過userId獲取用戶的socket.id
  getSockets(userId) {
    return this.userSockets.get(userId);
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

module.exports = UserManager;
