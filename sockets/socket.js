const userManager = require("./userManager");
const messageManager = require("./messageManager");
const realTimeManager = require("./realTimeManager");

const socket = (io) => {
  io.on("connection", (socket) => {
    console.log("成功建立連結");
    // setInterval(() => userManager.printAllUser(), 5000);

    try {
      userManager.saveUserAndSocket(socket);
    } catch (error) {
      console.error("驗證失敗:", error.message);
      socket.emit("auth_error", { message: "Token無效，請重新登錄。" });
      socket.disconnect(true);
      return;
    }

    // 初始聊天室環境
    socket.on("initChatRoom", async (callback) => {
      console.log(`initChatRoom`);
      try {
        const { userId, lastLogoutTime } = userManager.getUser(socket.id);
        console.log(`messageManager:${messageManager}`);
        const { conversation, partnerList, hasNewMessage } =
          await messageManager.handleGetPartnerMessages({
            userId,
            lastLogoutTime,
          });

        callback({
          success: true,
          data: { conversation, partnerList, hasNewMessage },
        });
      } catch (error) {
        console.error("initChatRoom失敗:", error.message);
        callback({ success: false, error: error.message });
      }
    });

    // 初始用戶資料 - 系統資訊、錢包
    socket.on("initUser", async (callback) => {
      try {
        const { userId } = userManager.getUser(socket.id);
        const { wallet, messages } = await realTimeManager.handleInit(userId);

        callback({
          success: true,
          data: { wallet, messages },
        });
      } catch (error) {
        console.error("initUser失敗:", error.message);
        callback({ success: false, error: error.message });
      }
    });

    // 獲取對象名稱
    socket.on("getReveiverName", async (receiverId, callback) => {
      try {
        const receiverName = await userManager.getReceiverName(receiverId);

        console.log(`receiverName: ${receiverName}`);

        callback({
          success: true,
          data: receiverName,
        });
      } catch (error) {
        console.error("initChatRoom失敗:", error.message);
        callback({ success: false, error: error.message });
      }
    });

    // 傳送消息事件
    socket.on(
      "onSendMessage",
      async ({ receiverId, receiverName, content }, callback) => {
        try {
          const sender = userManager.getUser(socket.id);
          if (!sender) {
            throw new Error("身分驗證失敗，無法發送消息");
          }
          const { userId: senderId, username: senderName } = sender;
          const senderSocketId = userManager.getSockets(senderId);
          const receiverSocketId = userManager.getSockets(receiverId);

          // 儲存時默認為'未讀'
          const messageId = await messageManager.handleSaveMessage({
            senderId,
            senderName,
            receiverId,
            receiverName,
            content,
          });

          // 發送時，接收方 默認為'未讀'
          await messageManager.handleSendMessage({
            senderSocketId,
            senderId,
            receiverId,
            senderName,
            receiverSocketId,
            content,
            messageId,
          });

          callback({ success: true });
        } catch (error) {
          console.error("onSendMessage失敗:", error.message);
          callback({ success: false, error: error.message });
        }
      }
    );

    socket.on(
      "updateReadStatus",
      async ({ unreadMessageIds, type }, callback) => {
        try {
          console.log(type);
          console.log(unreadMessageIds);
          if (type === "chat") {
            await messageManager.handleUpdateMessages(unreadMessageIds);
          } else if (type === "system") {
            await realTimeManager.handleUpdateMessages(unreadMessageIds);
          } else {
            throw new Error("未知的消息類型");
          }

          callback({ success: true });
        } catch (error) {
          console.error("updateReadStatus失敗:", error.message);
          callback({ success: false, error: error.message });
        }
      }
    );

    // 處理斷開事件
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
      userManager.removeUser(socket.id);
    });
  });
};

module.exports = socket;
