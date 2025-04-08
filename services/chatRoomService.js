const chatRoomRepository = require("../repository/chatRoomRepository");
const { InternalServerError } = require("../errors/httpErrors");

class ChatRoomService {
  constructor(chatRoomRepository) {
    this.chatRoomRepo = chatRoomRepository;
  }

  // 儲存聊天訊息
  async saveMessages({ sender = {}, receiver = {}, content }) {
    const { userId: senderId, username: senderName } = sender;
    const { userId: receiverId, username: receiverName } = receiver;
    if (!senderId || !senderName) {
      throw new InternalServerError("缺少發送者資訊");
    }

    if (!receiverId || !receiverName) {
      throw new InternalServerError("缺少寄送者資訊");
    }

    const message = await this.chatRoomRepo.create({
      senderId,
      senderName,
      receiverId,
      receiverName,
      content,
    });

    return message;
  }

  // 獲取聊天訊息;
  async getMessages(userId) {
    const messages = await this.chatRoomRepo.getMessagesByUserId(userId);

    return messages;
  }

  // 生成聊天室訊息
  createMessage({ sender, receiver, content, msgId }) {
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

  // 更新聊天室未讀狀態
  async markMessageAsRead({ currentUserId, unreadMessageIds }) {
    if (!currentUserId) throw new InternalServerError("缺少用戶 ID");

    if (!unreadMessageIds || !unreadMessageIds.length) {
      throw new InternalServerError("缺少訊息 ID");
    }

    await this.chatRoomRepo.updateReadStatusById(
      currentUserId,
      unreadMessageIds
    );
  }
}

const chatRoomService = new ChatRoomService(chatRoomRepository);
module.exports = chatRoomService;
