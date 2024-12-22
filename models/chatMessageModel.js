const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatMessageSchema = new Schema({
  senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  senderName: { type: String, required: true },
  receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  receiverName: { type: String, required: true },
  content: { type: String, required: true },
  isRead: { type: Boolean, default: false }, // 是否已讀狀態
  timestamp: { type: Date, default: Date.now }, // 每條消息的時間戳
});

// 靜態方法: 儲存訊息
chatMessageSchema.statics.saveMessage = function (
  senderId,
  senderName,
  receiverId,
  receiverName,
  content
) {
  try {
    const message = new this({
      senderId,
      senderName,
      receiverId,
      receiverName,
      content,
    });
    return message.save();
  } catch (error) {
    console.error("saveMessage失敗:", error);
    throw new Error(`資料層錯誤: ${error.message || "未知錯誤"}`);
  }
};

// 靜態方法: 批量更新訊息狀態
chatMessageSchema.statics.updateMessages = function (filter, update) {
  try {
    return this.updateMany(filter, update);
  } catch (error) {
    console.error("updateMany失敗:", error);
    throw new Error(`資料層錯誤: ${error.message || "未知錯誤"}`);
  }
};

// 靜態方法: 獲取對話
chatMessageSchema.statics.getPartnerMessages = async function (userId) {
  try {
    const messages = await this.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    }).sort({ timestamp: 1 });

    return messages;
  } catch (error) {
    console.error("getMessagesGroupedByPartner失敗:", error);
    throw new Error(`資料層錯誤: ${error.message || "未知錯誤"}`);
  }
};

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);
module.exports = ChatMessage;
