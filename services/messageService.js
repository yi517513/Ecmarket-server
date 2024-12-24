const chatMessageModel = require("../models/chatMessageModel");
const systemMessageModel = require("../models/systemMessageModel");

class MessageService {
  constructor(chatMessageModel, systemMessageModel) {
    this.chatModel = chatMessageModel;
    this.systemModel = systemMessageModel;
  }

  // 儲存聊天訊息
  async saveChatMessage({ sender, receiver, content }) {
    try {
      const message = await this.chatModel.saveMessage(
        sender.userId,
        sender.username,
        receiver.userId,
        receiver.username,
        content
      );

      return message;
    } catch (error) {
      console.error("handleSaveMessage失敗:", error.message);
      throw new Error("儲存訊息失敗，請稍後再試");
    }
  }

  // 儲存系統訊息
  async saveSystemMessage({ targetId, content, targetRoute }) {
    try {
      const message = await this.systemModel.saveMessage(
        targetId,
        content,
        targetRoute
      );

      return message;
    } catch (error) {
      console.error("handleSaveMessage失敗:", error.message);
      throw new Error("儲存訊息失敗，請稍後再試");
    }
  }

  // 獲取聊天訊息
  async getChatMessages(userId) {
    try {
      const messages = await this.chatModel.getMessages(userId);

      return messages;
    } catch (error) {
      console.error("getMessages失敗:", error.message);
      throw new Error("獲取聊天訊息失敗");
    }
  }

  // 獲取系統訊息
  async getSystemMessages(userId) {
    try {
      const messages = await this.systemModel.getMessages(userId);

      const transformedMessages = messages.map(({ _id, ...rest }) => ({
        messageId: _id.toString(),
        ...rest,
      }));

      return transformedMessages;
    } catch (error) {
      console.error("getSysMessages失敗:", error.message);
      throw new Error("獲取聊天訊息失敗");
    }
  }

  // 更新聊天室未讀狀態
  async updateChatMessageStatus(messageIds) {
    try {
      const result = await this.chatModel.updateMessages(
        { _id: { $in: messageIds } }, // 查找 _id 在 messageIds 中的訊息
        { $set: { isRead: true } } // 將 isRead 設為 true
      );

      return result;
    } catch (error) {
      console.error("updateMessageReadStatus失敗:", error.message);
      throw new Error("更新已讀狀態失敗");
    }
  }
  // 更新系統訊息未讀狀態
  async updateSystemMessageStatus(messageIds) {
    try {
      const result = await this.systemModel.updateMessages(
        { _id: { $in: messageIds } },
        { $set: { isRead: true } }
      );

      return result;
    } catch (error) {
      console.error("updateMessageReadStatus失敗:", error.message);
      throw new Error("更新已讀狀態失敗");
    }
  }

  // 生成聊天室訊息
  createChatMessage(sender, receiver, content, msgId) {
    const senderMsg = {
      message: {
        isSender: true,
        senderName: sender.username,
        content,
        isRead: true,
        msgId,
      },
      partner: {
        userId: receiver.userId,
        username: sender.username,
        unReadCount: 0,
      },
      error: null,
    };

    const receiverMsg = {
      message: {
        isSender: false,
        senderName: sender.username,
        content,
        isRead: false,
        msgId,
      },
      partner: {
        userId: sender.userId,
        username: sender.username,
        unReadCount: 1,
      },
      error: null,
    };

    return { senderMsg, receiverMsg };
  }
}

const messageService = new MessageService(chatMessageModel, systemMessageModel);
module.exports = messageService;
