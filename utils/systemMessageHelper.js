const userManager = require("../sockets/userManager");
const messageManager = require("../sockets/messageManager");
const SystemMessage = require("../models/systemMessageModel");

const sendSystemMessage = async ({ targetId, content, targetRoute }) => {
  try {
    // 獲取用戶的 socketId
    const socketId = userManager.getSockets(targetId);
    // 存到db
    const newMessage = await SystemMessage.saveMessage(
      targetId,
      content,
      targetRoute
    );

    const message = {
      content: newMessage.content,
      targetRoute: newMessage.targetRoute,
      messageId: newMessage._id.toString(),
      timestamp: newMessage.timestamp,
    };

    // 通過messageManager發送消息
    messageManager.sendMessage({
      socketId,
      message: message,
      targetRoute,
    });

    return true;
  } catch (error) {
    console.error("sendSystemMessage發生錯誤" + error);
    return false;
  }
};

module.exports = sendSystemMessage;
