const { eventBus } = require("./eventBus");
const { socketService } = require("../services");

module.exports = (io) => {
  eventBus.on("events:chat:updateSummary", ({ targetUserIds, summaries }) => {
    targetUserIds?.forEach((userId) => {
      const socketId = socketService.getSocketIdByUserId(userId);
      if (socketId) {
        io.to(socketId).emit(
          "server:chatRoom:updateSummary",
          summaries[userId]
        );
      }
    });
  });

  eventBus.on("events:chat:sendMessage", ({ targetUserIds, message }) => {
    targetUserIds?.forEach((userId) => {
      const socketId = socketService.getSocketIdByUserId(userId);
      if (socketId) {
        io.to(socketId).emit("server:chatRoom:sendMessage", message);
      }
    });
  });

  eventBus.on("events:chat:notify", ({ targetUserId }) => {
    const socketId = socketService.getSocketIdByUserId(targetUserId);
    if (socketId) {
      io.to(socketId).emit("server:chatRoom:notify");
    }
  });

  // 通知發送者，接收者已讀了哪些訊息
  eventBus.on(
    "events:chat:onMessageRead",
    ({ senderId, recipientId, messageIds }) => {
      const socketId = socketService.getSocketIdByUserId(senderId);
      if (socketId) {
        io.to(socketId).emit("server:chatRoom:onMessageRead", {
          recipientId,
          messageIds,
        });
      }
    }
  );
};
