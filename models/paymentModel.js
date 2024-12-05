const mongoose = require("mongoose");
const { Schema } = mongoose;

const paymentSchema = new Schema({
  amount: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  paymentHtml: { type: String, required: true },
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  paymentStatus: {
    type: String,
    enum: ["completed", "pending"],
    default: "pending",
  },
});

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
