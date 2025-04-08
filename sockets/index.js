const { authMiddleware } = require("./middleware/authMiddleware");
const { chatRoomHandlers } = require("./handlers/chatRoomHandlers");
const { tradeRoomHandlers } = require("./handlers/tradeRoomHandlers");

module.exports = (io) => {
  io.use(authMiddleware);

  io.on("connection", (socket) => {
    console.log("socket成功建立連結");

    chatRoomHandlers(socket);

    tradeRoomHandlers(socket);

    // 處理斷開事件
    socket.on("disconnect", () => {
      console.log("處理斷開事件");
    });
  });
};
