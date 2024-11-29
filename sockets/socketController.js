// 引入 index.js 中的 server
const index = require("../index");
const server = index.server;

// 使用 server 創建 Socket.IO 實例
const io = require("socket.io")(server);

const sendNotification = (userId, notification) => {
  const socket = io.sockets.sockets.get(`jro0ZEBxq9QQric9AAAD`);
  // console.log(`socket: ${socket}`);

  io.emit("notification", notification);

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    socket.emit("testEvent", { message: socket.id });
  });

  if (socket) {
    io.to(userId).emit("notification", notification);
  } else {
    console.log(`User ${userId} is not connected.`);
  }
  // console.log(userId);
  // 發送消息到指定用戶的房間
  io.emit("notification", notification);
};

module.exports = {
  sendNotification,
};
