const mongoose = require("mongoose");
const { Schema } = mongoose;

const transactionSchema = new Schema(
  {
    buyer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product: {
      type: new Schema({
        _id: String,
        title: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        images: [{ type: String, required: true }],
        owner: { type: String, required: true },
        totalAmount: { type: Number, required: true },
      }),
    },
    payment: { type: Schema.Types.ObjectId, ref: "Payment" },
    // 賣家的出貨狀態
    shipmentStatus: {
      type: String,
      enum: ["completed", "pending"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

transactionSchema.index({ buyerId: 1, shipmentStatus: 1 });
transactionSchema.index({ sellerId: 1, shipmentStatus: 1 });

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
