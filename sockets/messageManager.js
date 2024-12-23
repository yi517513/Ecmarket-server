const ChatMessage = require("../models/chatMessageModel");
const { getSocketInstance } = require("./socketService");
const io = getSocketInstance();

class MessageManager {
  constructor(io, MessageDb) {
    if (!io || !MessageDb) {
      throw new Error("MessageManager缺少必要的依賴");
    }
    this.io = io;
    this.db = MessageDb;
  }

  // 儲存對話紀錄
  async handleSaveMessage({
    senderId,
    senderName,
    receiverId,
    receiverName,
    content,
  }) {
    try {
      const message = await this.db.saveMessage(
        senderId,
        senderName,
        receiverId,
        receiverName,
        content
      );
      return message._id;
    } catch (error) {
      console.error("handleSaveMessage失敗:", error.message);
      throw new Error("儲存訊息失敗，請稍後再試");
    }
  }

  // 控制器使用
  sendMessage({ socketId, message, targetRoute }) {
    try {
      this.io.to(socketId).emit("systemMessage", { message, targetRoute });
    } catch (error) {
      this.io.to(socketId).emit("systemMessage", {
        message: null,
        targetRoute: null,
        error: "訊息發送失敗",
      });
      console.error(error);
    }
  }

  // 聊天室發送訊息
  async handleSendMessage({
    senderSocketId,
    senderId,
    receiverId,
    senderName,
    receiverSocketId,
    content,
    messageId,
  }) {
    try {
      // 發送給自己
      this.io.to(senderSocketId).emit("receiveMessage", {
        message: {
          isSender: true,
          senderName,
          content,
          isRead: true,
          messageId,
          // partnerId: receiverId,
        },
        partner: {
          userId: receiverId,
          username: senderName,
          unReadCount: 0,
        },
        error: null,
      });

      // 對方上線才發送
      if (receiverSocketId) {
        this.io.to(receiverSocketId).emit("receiveMessage", {
          message: {
            isSender: false,
            senderName,
            content,
            isRead: false,
            messageId,
            // partnerId: senderId,
          },
          partner: {
            userId: senderId,
            username: senderName,
            unReadCount: 1,
          },
          error: null,
        });
      }
    } catch (error) {
      this.io
        .to(senderSocketId)
        .emit("receiveMessage", { message: null, error: "訊息發送失敗" });
      console.error("handleSendMessage失敗", error.message);
      throw new Error("發送訊息失敗");
    }
  }

  async handleUpdateMessages(messageIds) {
    try {
      const result = await this.db.updateMessages(
        { _id: { $in: messageIds } }, // 查找 _id 在 messageIds 中的訊息
        { $set: { isRead: true } } // 將 isRead 設為 true
      );
      return result;
    } catch (error) {
      console.error("handleUpdateReadStatus失敗:", error.message);
      throw new Error("更新已讀狀態失敗");
    }
  }

  // 獲取與對向的對話
  async handleGetPartnerMessages({ userId, lastLogoutTime }) {
    try {
      const messages = await this.db.getPartnerMessages(userId);

      const result = {};
      const partnerSet = new Map();
      let hasNewMessage = false;

      messages.forEach((message) => {
        const isSender = message.senderId.toString() === userId.toString();
        // 對象id
        const partnerId = isSender
          ? message.receiverId.toString()
          : message.senderId.toString();
        const partnerName = isSender
          ? message.receiverName
          : message.senderName;

        // partnerList
        if (!partnerSet.has(partnerId)) {
          partnerSet.set(partnerId, {
            userId: partnerId,
            username: partnerName,
            unReadCount: 0,
          });
        }

        // conversation
        if (!result[partnerId]) {
          result[partnerId] = {
            partnerId,
            partnerName,
            messages: [],
          };
        }

        // 判定未讀訊息
        if (!message.isRead && !isSender) {
          const partnerData = partnerSet.get(partnerId);
          partnerSet.set(partnerId, {
            ...partnerData,
            unReadCount: partnerData.unReadCount + 1,
          });

          // 判定是否有新消息，剛註冊用戶lastLogoutTime為null
          if (
            lastLogoutTime &&
            new Date(message.timestamp) > new Date(lastLogoutTime)
          ) {
            hasNewMessage = true;
          }
        }

        // 將對話內容push到對應的對象
        result[partnerId].messages.push({
          isSender,
          senderName: message.senderName,
          content: message.content,
          isRead: isSender ? true : message.isRead,
          messageId: message._id,
          senderId: isSender ? userId : partnerId,
        });
      });

      const partnerList = Array.from(partnerSet.values());
      const conversation = Object.values(result);

      return { conversation, partnerList, hasNewMessage };
    } catch (error) {
      console.error("handleGetMessageWithPartner失敗:", error.message);
      throw new Error("獲取對話資料失敗");
    }
  }
}

const messageManager = new MessageManager(io, ChatMessage);
module.exports = messageManager;
