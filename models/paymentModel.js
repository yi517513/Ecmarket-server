const mongoose = require("mongoose");
const { Schema } = mongoose;

const paymentSchema = new Schema({
  payer: { type: Schema.Types.ObjectId, ref: "User", required: true },
  payee: { type: Schema.Types.ObjectId, ref: "User", required: true },
  paymentType: {
    type: String,
    enum: ["topUp", "purchase"],
    required: true,
  }, // 付款類型: 儲值或購買商品
  product: { type: Schema.Types.ObjectId, ref: "Product" },
  itemQuantity: { type: Number },
  itemPrice: { type: Number },
  totalAmount: { type: Number, required: true }, // 總付款金額
  paymentHtml: { type: String, required: true },
  paymentStatus: {
    type: String,
    enum: ["completed", "pending"],
    default: "pending",
  }, // 付款狀態
  isTransferred: {
    type: Boolean,
    default: false,
  }, // 是否完成轉移
});

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
