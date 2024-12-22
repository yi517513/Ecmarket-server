const mongoose = require("mongoose");
const { Schema } = mongoose;

const systemMessageSchema = new Schema({
  targetId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  targetRoute: { type: String, required: true },
  isRead: { type: Boolean, default: false }, // 是否已讀狀態
  timestamp: { type: Date, default: Date.now }, // 每條消息的時間戳
});

systemMessageSchema.statics.saveMessage = function (
  targetId,
  content,
  targetRoute
) {
  try {
    const message = new this({ targetId, content, targetRoute });
    return message.save();
  } catch (error) {
    console.error("saveMessage失敗:", error);
    throw new Error(`資料層錯誤: ${error.message || "未知錯誤"}`);
  }
};

systemMessageSchema.statics.getMessages = function (userId) {
  try {
    const messages = this.find({ targetId: userId })
      .select("-userId -__v")
      .sort({ timestamp: -1 });

    return messages;
  } catch (error) {
    console.error("getMessage失敗:", error);
    throw new Error(`資料層錯誤: ${error.message || "未知錯誤"}`);
  }
};

const SystemMessage = mongoose.model("SystemMessage", systemMessageSchema);
module.exports = SystemMessage;
