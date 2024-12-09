const { cookieParser } = require("../utils/cookieHelper");
const { decodeToken } = require("../utils/tokenHelper");
const RoomManager = require("./RoomManager");
const Message = require("../models/messageModel");
const UserManager = require("./userManager");
const MessageManager = require("./messageManager");

// const socket = (io) => {
//   const roomManager = new RoomManager(io, Message, Conversation);
//   // const MessageManager = new MessageManager();

//   io.on("connection", (socket) => {
//     console.log("成功建立連結");
//     const cookies = cookieParser(socket.handshake.headers.cookie);
//     const payload = decodeToken(cookies[`refreshToken`], "refresh");

//     // token驗證失敗
//     if (!payload || !payload.userId) {
//       socket.emit("error", "Token失效，已斷開連接。");
//       socket.disconnect(true);
//     }

//     // 檢查是否需要自動加入房間
//     roomManager.rejoinPersonalRoom(socket, payload.userId);

//     // 加入個人房間（登入後執行）
//     socket.on("onJoinRoom", ({ userName }) => {
//       roomManager.handleJoinRoom(socket, payload.userId, { userName });
//     });

//     // 傳送消息事件
//     socket.on("onSendMessage", ({ senderId, receiverId, content }) => {
//       roomManager.handleSaveConversaction({ senderId, receiverId });
//       roomManager.handleSaveMessage(socket, { senderId, receiverId, content });
//     });

//     // 前端點擊欄位發出emit，獲取對話紀錄
//     socket.on("onGetMessage", ({ userId, otherUserId }) => {
//       roomManager.handleGetMessage({ userId, otherUserId });
//     });

//     // 處理斷開事件
//     socket.on("disconnect", () => {
//       console.log(`User disconnected: ${socket.id}`);
//     });
//   });
// };

const socket = (io) => {
  const userManager = new UserManager();
  const messageManager = new MessageManager(io, Message);

  io.on("connection", (socket) => {
    console.log("成功建立連結");

    try {
      userManager.saveUserAndSocket(socket);
    } catch (error) {
      console.error(error.message);
      socket.emit("auth_error", { message: "Token無效，請重新登錄。" });
      socket.disconnect(true);
    }

    // 初始聊天室環境
    socket.on("initChatRoom", async (callback) => {
      try {
        const { userId } = userManager.getUser(socket.id);
        const partners = await messageManager.handleGetChatPartners({ userId });
        // 通過回調函數返回數據給前端
        callback(partners);
      } catch (error) {
        console.error("initChatRoom失敗:", error);
        callback({ error: "獲取初始失敗" });
      }
    });

    // 傳送消息事件
    socket.on(
      "onSendMessage",
      async ({ receiverId, receiverName, content }) => {
        try {
          console.log(`onSendMessage事件`);
          const sender = userManager.getUser(socket.id);
          if (!sender) {
            throw new Error("身分驗證失敗，無法發送消息");
          }
          const { userId: senderId, username: senderName } = sender;
          const senderSocketId = userManager.getSockets(senderId);
          const receiverSocketId = userManager.getSockets(receiverId);

          const saveMessagePromise = messageManager.handleSaveMessage({
            senderId,
            senderName,
            receiverId,
            receiverName,
            content,
          });

          const sendMessagePromise = messageManager.handleSendMessage({
            senderId: senderSocketId,
            senderName,
            receiverId: receiverSocketId,
            content,
          });

          await Promise.all([saveMessagePromise, sendMessagePromise]);
        } catch (error) {
          console.log(`onSendMessage異常，${error}`);
        }
      }
    );

    // // 前端點擊欄位發出emit，獲取對話紀錄
    // socket.on("onGetMessage", ({ userId, otherUserId }) => {
    //   roomManager.handleGetMessage({ userId, otherUserId });
    // });

    // 處理斷開事件
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
      userManager.removeUser(socket.id);
    });
  });
};

module.exports = socket;
