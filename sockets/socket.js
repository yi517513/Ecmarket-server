const { getUsersInRoom } = require("./socketService");

module.exports = (io) => {
  io.on("connection", (socket) => {
    // 從handshake 中獲取用戶ID
    // console.log(socket);
    const userId = socket.handshake.query.userId;
    const roomId = `room_${userId}`;

    // 加入房间
    socket.join(roomId);

    socket.on("message", () => {
      io.to(roomId).emit("message", "This is a server-triggered message");
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  // 将消息发送逻辑提取为一个函数
  const sendMessageToRoom = (eventName, roomId, message) => {
    io.to(roomId).emit(eventName, message);
  };

  // 导出这个函数，以便在其他地方使用
  return { sendMessageToRoom };
};
