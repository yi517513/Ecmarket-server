const socketService = require("../../services/socketService");
const chatRoomService = require("../../services/chatRoomService");
const {
  getPartnerList,
  getConversations,
  getHasNewMessage,
} = require("../helpers/chatRoomHelper");

const chatRoomHandlers = (socket) => {
  // 初始聊天室環境
  socket.on("client:chat:init", async (callback) => {
    try {
      const currentUserId = socket.user.userId;
      const lastLogoutTime = socket.user.lastLogoutTime;

      const messages = await chatRoomService.getMessages(currentUserId);

      const partnerList = getPartnerList(messages, currentUserId);
      const conversation = getConversations(messages, currentUserId);
      const hasNewMessage = getHasNewMessage(messages, lastLogoutTime);

      const response = { partnerList, conversation, hasNewMessage };

      callback({ success: true, data: response });
    } catch (error) {
      console.error("chat:init失敗:", error.message);
      callback({ success: false, error: error.message });
    }
  });

  // 獲取對象名稱
  socket.on("client:chat:newContact", async (targetId, callback) => {
    try {
      const username = socketService.getUsernameById(targetId);

      callback({ success: true, data: { username } });
    } catch (error) {
      console.error("chat:getReveiverName失敗:", error.message);
      callback({ success: false, error: error.message });
    }
  });

  // 傳送消息事件
  socket.on("client:chat:message", async ({ receiver, content }, callback) => {
    try {
      const sender = socket.user;

      const newMessage = await chatRoomService.saveMessages({
        sender,
        receiver,
        content,
      });

      const { senderMsg, receiverMsg } = chatRoomService.createMessage({
        sender,
        receiver,
        content,
        msgId: newMessage._id,
      });

      socketService.chatRoomSend({
        targetId: sender.userId,
        message: senderMsg,
      });

      socketService.chatRoomSend({
        targetId: receiver.userId,
        message: receiverMsg,
      });

      callback({ success: true });
    } catch (error) {
      console.error("chat:sendMessage發生錯誤", error.message);
      callback({ success: false, error: error.message });
    }
  });

  socket.on("client:chat:isRead", async ({ unreadMessageIds }, callback) => {
    try {
      const currentUserId = socket.user.userId;

      await chatRoomService.markMessageAsRead({
        currentUserId,
        unreadMessageIds,
      });
      callback({ success: true });
    } catch (error) {
      console.error("updateReadStatus失敗:", error.message);
      callback({ success: false, error: error.message });
    }
  });
};

module.exports = { chatRoomHandlers };
