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
  order: { type: Schema.Types.ObjectId, ref: "Order" },
  amount: { type: Number, required: true }, // 付款金額
  timestamp: { type: Date, default: Date.now },
});

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
