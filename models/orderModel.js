const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    buyer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    seller: { type: Schema.Types.ObjectId, ref: "User", required: true },

    // 商品快照
    productSnapshot: {
      productId: { type: String, required: true }, // 保留原始 ID 追蹤用途
      title: { type: String, required: true },
      category: { type: String, required: true },
    },

    quantity: { type: Number, required: true },
    totalAmount: { type: Number, required: true }, // price * quantity

    status: {
      type: String,
      enum: ["unpaid", "paid", "cancel"],
      default: "unpaid",
    },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model("Order", orderSchema);
module.exports = { OrderModel };
