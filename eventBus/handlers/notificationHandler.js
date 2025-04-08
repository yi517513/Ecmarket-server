const { eventEmitter } = require("../eventEmitter");
const SocketService = require("../../services/socketService");
const { InternalServerError } = require("../../errors/httpErrors");

module.exports = (io) => {
  eventEmitter.on("chatRoom.sendMessage", async ({ targetId, message }) => {
    if (!targetId) throw new InternalServerError("缺少對象 ID");
    if (!message) throw new InternalServerError("缺少訊息");

    const socketId = SocketService.getSocketByUserId(targetId);

    if (socketId) {
      io.to(socketId).emit("server:chat:message", message);
    }
  });

  eventEmitter.on("tradeRoom.sendMessage", async ({ targetId, message }) => {
    if (!targetId) throw new InternalServerError("缺少對象 ID");
    if (!message) throw new InternalServerError("缺少訊息");

    const socketId = SocketService.getSocketByUserId(targetId);

    if (socketId) {
      io.to(socketId).emit("server:trade:message", message);
    }
  });

  eventEmitter.on("systemMessage.notify", async ({ targetId }) => {
    if (!targetId) throw new InternalServerError("缺少對象 ID");
    if (!message) throw new InternalServerError("缺少訊息");

    const socketId = SocketService.getSocketByUserId(targetId);

    if (socketId) {
      io.to(socketId).emit("server:system:message", message);
    }
  });

  eventEmitter.on("error.sendMessage", async ({ targetId, message }) => {
    if (!targetId) throw new InternalServerError("缺少對象 ID");
    if (!message) throw new InternalServerError("缺少訊息");

    const socketId = SocketService.getSocketByUserId(targetId);

    if (socketId) {
      io.to(socketId).emit("server:chat:message", message);
    }
  });

  eventEmitter.on("demo.sendMessage", async ({ targetId, message }) => {
    const socketId = SocketService.getSocketByUserId(targetId);

    if (socketId) {
      io.to(socketId).emit("server:chat:message", message);
    }
  });
};
