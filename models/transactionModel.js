const mongoose = require("mongoose");
const { Schema } = mongoose;

const transactionSchema = new Schema({
  payer: { type: Schema.Types.ObjectId, ref: "User", required: true }, // 付款人
  payee: { type: Schema.Types.ObjectId, ref: "User", required: true }, // 收款人
  payment: { type: Schema.Types.ObjectId, ref: "Payment", required: true }, // 關聯付款
  amount: { type: Number, required: true }, // 交易金額
  transactionType: {
    type: String,
    enum: ["transfer", "refund"],
    required: true,
  }, // 交易類型：儲值、購買、退款
  createdAt: { type: Date, default: Date.now }, // 交易建立時間
});

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
