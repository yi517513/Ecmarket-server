const { cookieParser } = require("../utils/cookieHelper");
const { decodeToken } = require("../utils/tokenHelper");
const User = require("../models/userModel");

class UserManager {
  constructor(User) {
    this.db = User;
    this.socketUsers = new Map();
    this.userSockets = new Map();
  }

  printAllUser() {
    console.log(this.userSockets);
    console.log(`=====================================================`);
  }

  // decode refresh token 並獲取 userId與username
  verifyToken(socket) {
    try {
      const cookie = cookieParser(socket.handshake.headers.cookie);
      const payload = decodeToken(cookie["refreshToken"], "refresh");

      if (!payload || !payload.id) {
        throw new Error("無效的Token!");
      }

      const { id: userId, username, lastLogoutTime } = payload;

      return { userId, username, lastLogoutTime };
    } catch (error) {
      throw new Error("驗證失敗: " + error.message);
    }
  }

  // 儲存userId與Socket
  saveUserAndSocket(socket) {
    try {
      const { userId, username, lastLogoutTime } = this.verifyToken(socket);

      // 將 socket.id 映射到用戶資料
      this.socketUsers.set(socket.id, { userId, username, lastLogoutTime });
      // 將 userId 映射到單一的 socket.id
      this.userSockets.set(userId, socket.id);
    } catch (error) {
      console.error(
        `保存用戶資料失敗 - socket.id: ${socket.id}, 原因: ${error.message}`
      );
      throw new Error("保存用戶資料失敗");
    }
  }

  async getReceiverName(userId) {
    try {
      const receiverName = await this.db
        .findById(userId)
        .select("username -_id");

      return receiverName;
    } catch (error) {
      console.error(
        `獲取對象資料失敗 - userId: ${userId}, 原因: ${error.message}`
      );
      throw new Error("獲取對象資料失敗");
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
const userManager = new UserManager(User); // 確保只有一個實例
module.exports = userManager;
