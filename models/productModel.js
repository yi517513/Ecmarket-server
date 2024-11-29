const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    title: { type: String, minlength: 3 },
    price: { type: Number, required: true },
    inventory: { type: Number, required: true },
    description: { type: String, required: true },
    images: [
      {
        _id: { type: Schema.Types.ObjectId, ref: "Image" },
        url: { type: String },
      },
    ],
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    transactions: [{ type: Schema.Types.ObjectId, ref: "Transaction" }], // 交易記錄
    pendingShipment: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
