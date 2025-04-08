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

// 建立複合索引：針對 senderId 與 _id
chatMessageSchema.index({ senderId: 1, _id: 1 });

// 建立複合索引：針對 receiverId 與 _id
chatMessageSchema.index({ receiverId: 1, _id: 1 });

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);
module.exports = ChatMessage;
