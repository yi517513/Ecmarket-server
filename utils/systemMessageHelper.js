const userManager = require("../services/userService");
const messageManager = require("../services/messageService");
const System = require("../models/systemMessageModel");
const getRouteMessage = require("../utils/messageUtils");

const sendSystemMessage = async ({ targetId, targetRoute, type, option }) => {
  try {
    // 根據目標路由生成訊息
    const content = getRouteMessage(targetRoute, type, option);

    // 獲取用戶的 socketId
    const socketId = userManager.getSockets(targetId);

    // 存到db
    const newMessage = await System.saveMessage(targetId, content, targetRoute);

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
