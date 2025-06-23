const mongoose = require("mongoose");
const { Schema } = mongoose;

const paymentSchema = new Schema({
  buyer: { type: Schema.Types.ObjectId, ref: "User", required: true },
  seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
  orderId: { type: String, required: true },
  TradeAmt: { type: Number, required: true }, // 付款金額
  createAt: { type: Date, default: Date.now },
});

const PaymentModel = mongoose.model("Payment", paymentSchema);
module.exports = { PaymentModel };
