const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
  buyer: { type: Schema.Types.ObjectId, ref: "User", required: true },
  seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
  product: { type: Schema.Types.ObjectId, ref: "Product" },
  itemQuantity: { type: Number },
  itemPrice: { type: Number },
  itemTitle: { type: String },
  totalAmount: { type: Number, required: true }, // 訂單總金額
  orderStatus: {
    type: String,
    enum: ["unpaid", "paid", "ongoing", "shipped", "completed", "canceled"],
    default: "unpaid",
  }, // 訂單狀態
  cancelRequest: {
    type: String,
    enum: ["none", "buyer", "seller", "both"],
    default: "none",
  },
  payment: { type: Schema.Types.ObjectId, ref: "Payment" }, // 關聯付款記錄
  shippedAt: { type: Date }, // 出貨時間
  completedAt: { type: Date }, // 完成時間
  canceledReason: { type: String },
  timestamp: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
