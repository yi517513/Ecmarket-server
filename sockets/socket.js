const { getRealTimeManager, getChatManager } = require("../managers/index");
const socketService = require("../services/socketService");
const userService = require("../services/userService");
const realTimeManager = getRealTimeManager();
const chatManager = getChatManager();

const { cookieParser } = require("../utils/cookieHelper");
const { decodeToken } = require("../utils/tokenHelper");

const socket = (io) => {
  io.use((socket, next) => {
    // decode refresh token 並獲取 userId與username
    const cookie = cookieParser(socket.handshake.headers.cookie);
    const payload = decodeToken(cookie["refreshToken"], "refresh");

    if (!payload || !payload.id) {
      throw new Error("無效的Token!");
    }
    // 將已驗證的用戶資訊存入socket.user
    const { id: userId, username, lastLogoutTime } = payload;
    socket.user = { userId, username, socketId: socket.id, lastLogoutTime };

    // 保存socket與用戶的關聯
    socketService.saveSocketUser(socket.id, userId, username, lastLogoutTime);
    next();
  });

  io.on("connection", (socket) => {
    console.log("成功建立連結");

    // 初始聊天室環境
    socket.on("chat:init", async (callback) => {
      try {
        const response = await chatManager.initChatApp({
          userId: socket.user.userId,
          lastLogoutTime: socket.user.lastLogoutTime,
        });

        callback({ success: true, data: response });
      } catch (error) {
        console.error("chat:init失敗:", error.message);
        callback({ success: false, error: error.message });
      }
    });

    // 初始即時狀態 - 系統通知、用戶錢包
    socket.on("realtime:init", async (callback) => {
      try {
        const response = await realTimeManager.initRealTime(socket.user.userId);

        callback({ success: true, data: response });
      } catch (error) {
        console.error("realtime:init失敗:", error.message);
        callback({ success: false, error: error.message });
      }
    });

    // 獲取對象名稱
    socket.on("chat:getReveiverName", async (receiverId, callback) => {
      try {
        const receiverName = await userService.getUsername(receiverId);

        callback({
          success: true,
          data: receiverName,
        });
      } catch (error) {
        console.error("chat:getReveiverName失敗:", error.message);
        callback({ success: false, error: error.message });
      }
    });

    // 傳送消息事件
    socket.on("chat:sendMessage", async ({ receiver, content }, callback) => {
      try {
        const { senderSocketId, senderMsg, receiverSocketId, receiverMsg } =
          await chatManager.sendMessage(socket.user, receiver, content);

        io.to(senderSocketId).emit("chat:receiveMessage", senderMsg);
        // 對方上線才發送
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("chat:receiveMessage", receiverMsg);
        }

        callback({ success: true });
      } catch (error) {
        io.to(senderSocketId).emit("chat:receiveMessage", {
          message: null,
          error: "訊息發送失敗",
        });
        console.error("onSendMessage失敗:", error.message);
        callback({ success: false, error: error.message });
      }
    });

    socket.on(
      "realtime:updateReadStatus",
      async ({ unreadMessageIds, type }, callback) => {
        try {
          await realTimeManager.updateIsReadStatus(unreadMessageIds, type);
          callback({ success: true });
        } catch (error) {
          console.error("updateReadStatus失敗:", error.message);
          callback({ success: false, error: error.message });
        }
      }
    );

    // 處理斷開事件
    socket.on("disconnect", () => {
      socketService.removeUser(socket.id);
    });
  });
};

module.exports = socket;
