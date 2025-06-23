const chatMessageModel = require("../models/messageModel");

class ChatRoomRepository {
  constructor(model) {
    this.db = model;
  }

  // 透過 userId 獲取對應的聊天內容
  async getMessagesByUserId(userId) {
    return await this.db
      .find({ $or: [{ senderId: userId }, { receiverId: userId }] })
      .sort({ timestamp: 1 });
  }

  // 將 db 中符合 [messageId] 的聊天訊息更新成 '已讀'
  async updateReadStatusById(userId, messageIds) {
    await this.db.updateMany(
      {
        $or: [
          { _id: { $in: messageIds }, senderId: userId },
          { _id: { $in: messageIds }, receiverId: userId },
        ],
      },
      { $set: { isRead: true } }
    );
  }
}

const chatRoomRepository = new ChatRoomRepository(chatMessageModel);
module.exports = chatRoomRepository;
