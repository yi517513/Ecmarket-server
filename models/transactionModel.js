const mongoose = require("mongoose");
const { Schema } = mongoose;

const transactionSchema = new Schema(
  {
    buyerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sellerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    totalAmount: { type: Number, required: true },
    paymentHtml: { type: String },
    // 買家的付款狀態
    paymentStatus: {
      type: String,
      enum: ["completed", "pending"],
      default: "pending",
    },
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

// 為 buyerId 和 sellerId 添加索引以加快查詢速度
transactionSchema.index({ buyerId: 1 });
transactionSchema.index({ sellerId: 1 });
transactionSchema.index({ sellerId: 1, paymentStatus: 1 });

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
