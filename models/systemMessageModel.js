const mongoose = require("mongoose");
const { Schema } = mongoose;

const systemMessageSchema = new Schema({
  targetId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  targetRoute: { type: String, required: true },
  isRead: { type: Boolean, default: false }, // 是否已讀狀態
  timestamp: { type: Date, default: Date.now }, // 每條消息的時間戳
});

systemMessageSchema.statics.saveMessage = async function (
  targetId,
  content,
  targetRoute
) {
  try {
    const message = await new this({ targetId, content, targetRoute }).save();

    return message;
  } catch (error) {
    console.error("saveMessage失敗:", error);
    throw new Error(`資料層錯誤: ${error.message || "未知錯誤"}`);
  }
};

// 靜態方法: 批量更新訊息狀態
systemMessageSchema.statics.updateMessages = function (filter, update) {
  try {
    return this.updateMany(filter, update);
  } catch (error) {
    console.error("updateMany失敗:", error);
    throw new Error(`資料層錯誤: ${error.message || "未知錯誤"}`);
  }
};

systemMessageSchema.statics.getMessages = async function (userId) {
  try {
    const messages = await this.find({ targetId: userId })
      .select("-targetId -__v")
      .sort({ timestamp: -1 })
      .lean();

    return messages;
  } catch (error) {
    console.error("getMessage失敗:", error);
    throw new Error(`資料層錯誤: ${error.message || "未知錯誤"}`);
  }
};

const SystemMessage = mongoose.model("SystemMessage", systemMessageSchema);
module.exports = SystemMessage;
