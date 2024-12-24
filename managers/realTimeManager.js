class RealTimeManager {
  constructor(socketService, userService, messageService) {
    this.socket = socketService;
    this.user = userService;
    this.message = messageService;
  }
  async initRealTime(userId) {
    try {
      const [wallet, messages] = await Promise.all([
        this.user.getUserWallet(userId),
        this.message.getSystemMessages(userId),
      ]);

      return { wallet, messages };
    } catch (error) {
      console.error(error.message);
      throw new Error("initRealTime發生錯誤");
    }
  }

  async saveSystemMessage({ targetId, targetRoute, content }) {
    // 獲取用戶的 socketId
    const socketId = this.socket.getSockets(targetId);

    // 存到db
    const newMessage = await this.message.saveSystemMessage({
      targetId,
      content,
      targetRoute,
    });

    const message = {
      content: newMessage.content,
      targetRoute: newMessage.targetRoute,
      messageId: newMessage._id.toString(),
      timestamp: newMessage.timestamp,
    };

    return { socketId, message };
  }

  async updateIsReadStatus(unreadMessageIds, type) {
    if (type === "chat") {
      await this.message.updateChatMessageStatus(unreadMessageIds);
    } else if (type === "system") {
      await this.message.updateSystemMessageStatus(unreadMessageIds);
    } else {
      throw new Error("updateIsReadStatus發生錯誤，type為錯誤類型");
    }
  }
}

module.exports = RealTimeManager;
