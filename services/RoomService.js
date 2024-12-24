class RoomService {
  constructor(io, MessageDb, ConversationDb) {
    this.io = io;
    this.message = MessageDb;
    this.conversaction = ConversationDb;
    this.userRoom = {};
  }

  // 加入個人房間（登入後執行）
  handleJoinRoom(socket, userId, { username }) {
    const room = `user_${userId}`;
    this.userRoom[userId] = {
      room,
      username,
    };
    socket.join(room);

    this.io.to(room).emit("roomJoined", `${username} 加入個人房間`);
  }

  rejoinPersonalRoom(socket, userId) {
    if (this.userRoom[userId]) {
      const { room, username } = this.userRoom[room];
      socket.join(room); // 加回房間

      this.io
        .to(personalRoom)
        .emit("roomRejoined", `${username} 重新連接到房間`);
    }
  }

  // 儲存聊天對象
  // async handleSaveConversaction({ senderId, receiverId }) {
  //  const userId =
  // }

  // 儲存聊天紀錄
  async handleSaveMessage(socket, { senderId, receiverId, content }) {
    // 資料庫儲存message
    const senderName = await this.message.saveMessage(
      senderId,
      receiverId,
      content
    );
    socket.join(receiverId);
    this.broadcastRoomMessage({ senderName, receiverId, content });
  }

  // 處理獲取對話紀錄的請求
  async handleGetMessage({ userId, otherUserId }) {
    const messages = await this.message.getMessages(userId, otherUserId);
    this.sendChatRecordToClient(userId, messages);
  }

  // 廣播消息
  broadcastRoomMessage({ senderName, receiverId, content }) {
    const receiverRoom = `user_${receiverId}`;
    this.io.to(receiverRoom).emit("roomMessage", { senderName, content });
  }

  // 發送對話紀錄給用戶
  sendChatRecordToClient(userId, messages) {
    const userRoom = `user_${userId}`;
    this.io.to(userRoom).emit("chatRecord", { messages });
  }
}

module.exports = RoomService;
