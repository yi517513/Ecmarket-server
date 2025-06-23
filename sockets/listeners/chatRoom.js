const { socketService } = require("../../services");

module.exports = (io, socket) => {
  // 發送訊息
  socket.on("chatRoom:sendMessage", ({ recipientId, content }) => {
    const senderId = socket.user?.userId;
    const senderSocketId = socket.user?.socketId;

    const message = { from: senderId, to: recipientId, content, isRead: false };

    // emit message
    io.to(senderSocketId).emit("server:chatRoom:sendMessage", message);
    const recipientSocketId = socketService.getSocketIdByUserId(recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("server:chatRoom:sendMessage", message);
    }
  });
};
