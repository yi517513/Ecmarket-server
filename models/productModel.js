const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    title: { type: String, minlength: 3 },
    price: { type: Number, required: true },
    inventory: { type: Number, required: true },
    description: { type: String, required: true },
    images: [{ type: String, required: true }],
    seller: {
      userId: { type: String, required: true },
      username: { type: String, required: true },
    },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }], // 追蹤的用戶
    soldAmount: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
