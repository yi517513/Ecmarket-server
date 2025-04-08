// const Socket = require("../config/socket");
const { InternalServerError } = require("../errors/httpErrors");

class SocketService {
  constructor() {
    this.io = "test";
    this.socketUsers = new Map();
    this.userSockets = new Map();
  }

  chatRoomSend = ({ targetId, message }) => {
    if (!targetId) throw new InternalServerError("缺少對象 ID");
    if (!message) throw new InternalServerError("缺少訊息");

    const socketId = this.userSockets.get(targetId);

    if (socketId) {
      this.io.to(socketId).emit("server:chat:message", message);
    }
  };

  tradeRoomSend = ({ targetId, message }) => {
    if (!targetId) throw new InternalServerError("缺少對象 ID");
    if (!message) throw new InternalServerError("缺少訊息");

    const socketId = this.userSockets.get(targetId);

    if (socketId) {
      this.io.to(socketId).emit("trade:receiveMessage", message);
    }
  };

  systemMessageNotify = (userId) => {
    if (!userId) throw new InternalServerError("缺少用戶 ID");

    const socketId = this.userSockets.get(userId);

    if (socketId) {
      this.io.to(socketId).emit("systemMessage:notification", true);
    }
  };

  // 儲存userId與Socket
  saveSocketUser({ socketId, userId, username, lastLogoutTime }) {
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
  getUserBySocketId(socketId) {
    return this.socketUsers.get(socketId) || null;
  }

  // 透過userId獲取用戶的socket.id
  getSocketByUserId(userId) {
    return this.userSockets.get(userId) || null;
  }

  // 透過userId獲取用戶資料
  getUsernameById(userId) {
    const socketId = this.userSockets.get(userId);
    return this.socketUsers.get(socketId)?.username || null;
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

// printAllUser() {
//   console.log(this.socketUsers);
//   console.log(this.userSockets);
//   console.log(`=====================================================`);
// }
