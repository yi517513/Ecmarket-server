class SocketService {
  constructor() {
    this.userIdToSocketId = new Map(); // _id => socketId
  }

  // 註冊使用者連線
  bindUserSocket(userId, socketId) {
    this.userIdToSocketId.set(userId, socketId);
  }

  // 透過 userId 找對應 socketId
  getSocketIdByUserId(userId) {
    return this.userIdToSocketId.get(userId) || null;
  }

  // 移除對應關係
  unbindUserSocket(userId) {
    this.userIdToSocketId.delete(userId);
  }

  // 判斷使用者是否在線
  isOnline(userId) {
    return this.userIdToSocketId.has(userId);
  }

  // 除錯用
  printAll() {
    console.log("userIdToSocketId:", this.userIdToSocketId);
  }
}

module.exports = { SocketService };
