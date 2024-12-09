const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema({
  senderId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // 參考 User 模型
  senderName: { type: String, required: true },
  receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  receiverName: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }, // 每條消息的時間戳
});

// 靜態方法: 儲存訊息
messageSchema.statics.saveMessage = async function (
  senderId,
  senderName,
  receiverId,
  content
) {
  const message = new this({
    senderId,
    senderName,
    receiverId,
    receiverName,
    content,
  });

  return message.save();
};

// 靜態方法：獲取對話紀錄
messageSchema.statics.getMessages = async function (userId, otherUserId) {
  const messages = await this.find({
    $or: [
      { senderId: userId, receiverId: otherUserId },
      { senderId: otherUserId, receiverId: userId },
    ],
  }).sort({ timestamp: 1 });

  return messages;
};

// 靜態方法：列出曾與自己對話過的用戶名單
messageSchema.statics.getChatPartners = async function (userId) {
  console.log(userId);
  const messages = await this.find({
    $or: [{ senderId: userId }, { receiverId: userId }],
  }).select("senderId receiverId -_id");

  // 提取所有相關的用戶ID
  const userIds = messages.reduce((set, message) => {
    // 如果 senderId 不是當前 userId，將其加入 Set
    if (message.senderId.toString() !== userId.toString()) {
      set.add({
        partnerId: message.senderId.toString(),
        partnerName: message.senderName.toString(),
      });
    }
    // 如果 receiverId 不是當前 userId，將其加入 Set
    if (message.receiverId.toString() !== userId.toString()) {
      set.add({
        partnerId: message.receiverId.toString(),
        partnerName: message.receiverName.toString(),
      });
    }

    return set; // 必須返回累加器
  }, new Set());

  return Array.from(userIds);
};

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
