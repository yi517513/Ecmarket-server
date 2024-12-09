class MessageManager {
  constructor(io, MessageDb) {
    this.io = io;
    this.db = MessageDb;
  }

  // 儲存對話紀錄
  async handleSaveMessage({ senderId, senderName, receiverId, content }) {
    try {
      await this.db.saveMessage(senderId, senderName, receiverId, content);
    } catch (error) {
      console.log(`handleSaveMessage失敗，${error}`);
    }
  }

  // 發送訊息
  async handleSendMessage({ senderId, senderName, receiverId, content }) {
    try {
      this.io.to(receiverId).emit("receiveMessage", { senderName, content });
      this.io.to(senderId).emit("receiveMessage", { senderName, content });
    } catch (error) {
      console.log(`handleSendMessage失敗，${error}`);
    }
  }

  async handleGetChatPartners({ userId }) {
    try {
      const partners = await this.db.getChatPartners(userId);

      return partners;
    } catch (error) {
      console.log(`handleGetChatPartners失敗，${error}`);
    }
  }
}

module.exports = MessageManager;
