const { cookieParser } = require("../../helpers/cookieHelper");
const { verifyToken } = require("../../helpers/tokenHelper");
const socketService = require("../../services/socketService");

const authMiddleware = async (socket, next) => {
  try {
    // decode refresh token 並獲取 userId 與 username
    const cookie = cookieParser(socket.handshake.headers.cookie);

    if (!cookie["jwt"]) {
      socket.user = { socketId: socket.id, isAuthenticated: false };
      socketService.saveSocketUser({ socketId: socket.id });
      return next(); // 未登入狀態
    }

    const payload = await verifyToken(cookie["jwt"], "jwt");

    if (!payload || !payload.userId) {
      return next(new Error("無效的Token!"));
    }
    // 將已驗證的用戶資訊存入socket.user
    socket.user = { ...payload, socketId: socket.id, isAuthenticated: true };
    // 保存socket與用戶的關聯
    socketService.saveSocketUser({ ...socket.user });
    next();
  } catch (error) {
    next(new Error("伺服器驗證錯誤")); // 確保所有錯誤被捕獲
  }
};

module.exports = { authMiddleware };
