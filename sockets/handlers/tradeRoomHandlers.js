const tradeRoomService = require("../../services/tradeRoomService");
const socketService = require("../../services/socketService");

const tradeRoomHandlers = (socket) => {
  socket.on("trade:init", async ({ orderId }, callback) => {
    try {
      socket.join(orderId);

      // messages 未做處理，只做排序
      const messages = await tradeRoomService.getMessages({ orderId });

      callback({ success: true, data: messages });
    } catch (error) {
      console.error("trade:init失敗:", error.message);
      callback({ success: false, error: error.message });
    }
  });

  // 退出交易房間
  socket.on("trade:leaveRoom", ({ orderId }, callback) => {
    try {
      socket.leave(orderId);

      console.log(`用户 ${socket.id} 退出交易房間 ${orderId}`);

      callback({ success: true });
    } catch (error) {
      callback({ success: false, error: error.message });
    }
  });

  // 傳送消息事件
  socket.on("trade:sendMessage", async ({ orderId, content }, callback) => {
    try {
      const senderId = socket.user.userId;

      const message = await tradeRoomService.saveMessage({
        senderId,
        orderId,
        content,
      });

      socketService.tradeRoomSend({ targetId: orderId, message });

      callback({ success: true });
    } catch (error) {
      console.error("transaction:sendMessage發生錯誤", error.message);
      callback({ success: false, error: error.message });
    }
  });
};

module.exports = { tradeRoomHandlers };
