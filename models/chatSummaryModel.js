const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatSummarySchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true }, // 自己
  peer: { type: Schema.Types.ObjectId, ref: "User", required: true }, // 聊天對象
  lastMessage: String,
  lastTime: Date,
  unreadCount: { type: Number, default: 0 },
});

chatSummarySchema.index({ owner: 1, lastTime: -1 });
chatSummarySchema.index({ owner: 1, peer: 1 }, { unique: true });

chatSummarySchema.set("toJSON", {
  transform(doc, ret) {
    // 移除不必要欄位
    delete ret.__v;
    delete ret.owner;

    // 若 peer 存在 (populate 過)，挑選必要欄位並扁平化
    if (ret.peer && typeof ret.peer === "object") {
      const { _id, uid, username } = ret.peer || {};
      ret.userId = _id;
      ret.uid = uid;
      ret.username = username;

      delete ret.peer;
      delete ret._id;
    }

    return ret;
  },
});

const ChatSummaryModel = mongoose.model("ChatSummary", chatSummarySchema);
module.exports = { ChatSummaryModel };
