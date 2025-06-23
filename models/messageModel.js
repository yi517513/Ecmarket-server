const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema({
  from: { type: Schema.Types.ObjectId, ref: "User", required: true },
  to: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  isRead: { type: Boolean, default: false }, // 是否已讀狀態
  createdAt: { type: Date, default: Date.now },
});

// 建立複合索引
messageSchema.index({ from: 1, to: 1, isRead: 1, createdAt: 1 });
messageSchema.index({ from: 1, to: 1, createdAt: -1 });

const MessageModel = mongoose.model("Message", messageSchema);

module.exports = { MessageModel };
