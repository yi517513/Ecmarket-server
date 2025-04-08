const mongoose = require("mongoose");
const { Schema } = mongoose;

const systemMessageSchema = new Schema({
  targetId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  isRead: { type: Boolean, default: false }, // 是否已讀狀態
  timestamp: { type: Date, default: Date.now }, // 每條消息的時間戳
  type: { type: String, enum: ["SUCCESS", "ERROR"], required: true },
});

const SystemMessage = mongoose.model("SystemMessage", systemMessageSchema);
module.exports = SystemMessage;
