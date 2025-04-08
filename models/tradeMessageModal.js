const mongoose = require("mongoose");
const { Schema } = mongoose;

const tradeMessageSchema = new Schema({
  senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  orderId: { type: Schema.Types.ObjectId, required: true, ref: "Order" },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const tradeMessage = mongoose.model("TradeMessage", tradeMessageSchema);
module.exports = tradeMessage;
