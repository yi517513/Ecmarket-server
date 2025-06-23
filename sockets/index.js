const authenticate = require("./middleware/authMiddleware");
// const chatRoom = require("./listeners/chatRoom");
const { socketService } = require("../services");

module.exports = (io) => {
  io.use(authenticate);

  io.on("connection", (socket) => {
    // 正在輸入中..
    socket.on("chatRoom:typing", ({ to }) => {
      const senderId = socket.user?.userId;
      const recipientSocketId = socketService.getSocketIdByUserId(to);

      if (!recipientSocketId) return;
      io.to(recipientSocketId).emit("server:chatRoom:typing", {
        from: senderId,
      });
    });

    // 處理斷開事件
    socket.on("disconnect", () => {
      socketService.unbindUserSocket(socket.user?.userId);
    });
  });
};
