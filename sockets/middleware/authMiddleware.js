const { cookieParser } = require("../../utils/helpers");
const { BadRequestError } = require("../../errors");
const { identifyToken } = require("../../utils/helpers");
const { socketService } = require("../../services");

const authenticate = async (socket, next) => {
  try {
    // ==== 提取 JWT token ====
    const cookie = cookieParser(socket.handshake.headers.cookie);

    // === 驗證 Token 並回傳結果
    const { status, user } = await identifyToken(cookie["jwt"]);

    // ==== 無效或沒有，進入後續流程 ====
    if (status === "none" || status === "invalid") return next();

    // 將已驗證的用戶資訊存入 socket.user 與 service 管理
    const socketId = socket.id;
    const { _id, uid, username, logoutAt } = user || {};

    socket.user = { socketId, userId: _id, uid, username, logoutAt };
    socketService.bindUserSocket(_id, socketId);

    next();
  } catch (error) {
    next(new BadRequestError("Unauthorized"));
  }
};

module.exports = authenticate;
