class ChatManager {
  constructor(socketService, messageService) {
    this.socket = socketService;
    this.message = messageService;
  }
  // 整合數據
  async initChatApp({ userId, lastLogoutTime }) {
    try {
      const messages = await this.message.getChatMessages(userId);

      const partnerList = this._getPartnerList(messages, userId);
      const conversation = this._getConversations(messages, userId);
      const hasNewMessage = this._getHasNewMessage(messages, lastLogoutTime);

      return { conversation, partnerList, hasNewMessage };
    } catch (error) {
      console.error("organizeMessages失敗:", error.message);
      throw new Error("獲取對話資料失敗");
    }
  }

  async sendMessage(sender, receiver, content) {
    const senderSocketId = sender.socketId;
    const receiverSocketId = this.socket.getSockets(receiver.userId);

    // 儲存時默認為'未讀'
    const message = await this.message.saveChatMessage({
      sender,
      receiver,
      content,
    });

    const { senderMsg, receiverMsg } = this.message.createChatMessage(
      sender,
      receiver,
      content,
      message._id
    );

    return { senderSocketId, senderMsg, receiverSocketId, receiverMsg };
  }

  // 提取 partnerList
  _getPartnerList(messages, userId) {
    const partnerSet = new Map();
    messages.forEach((message) => {
      const isSender = message.senderId.toString() === userId.toString();
      const partnerId = isSender
        ? message.receiverId.toString()
        : message.senderId.toString();
      const partnerName = isSender ? message.receiverName : message.senderName;

      // 初始化 partner
      if (!partnerSet.has(partnerId)) {
        partnerSet.set(partnerId, {
          userId: partnerId,
          username: partnerName,
          unReadCount: 0,
        });
      }

      // 更新未讀數量
      if (!message.isRead && !isSender) {
        const partnerData = partnerSet.get(partnerId);
        partnerSet.set(partnerId, {
          ...partnerData,
          unReadCount: partnerData.unReadCount + 1,
        });
      }
    });

    return Array.from(partnerSet.values());
  }

  // 提取 conversation
  _getConversations(messages, userId) {
    const result = {};
    messages.forEach((message) => {
      const isSender = message.senderId.toString() === userId.toString();
      const partnerId = isSender
        ? message.receiverId.toString()
        : message.senderId.toString();
      const partnerName = isSender ? message.receiverName : message.senderName;

      if (!result[partnerId]) {
        result[partnerId] = {
          partnerId,
          partnerName,
          messages: [],
        };
      }

      result[partnerId].messages.push({
        isSender,
        senderName: message.senderName,
        content: message.content,
        isRead: isSender ? true : message.isRead,
        messageId: message._id,
        senderId: isSender ? userId : partnerId,
      });
    });

    return Object.values(result);
  }

  // 判斷是否有新消息
  _getHasNewMessage(messages, lastLogoutTime) {
    if (!lastLogoutTime) return false;

    return messages.some(
      (message) => new Date(message.timestamp) > new Date(lastLogoutTime)
    );
  }
}

module.exports = ChatManager;
