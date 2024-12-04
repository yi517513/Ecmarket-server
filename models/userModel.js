const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: { type: String, minlength: 3 },
    email: { type: String, minlength: 6, required: true, unique: true },
    password: { type: String, minlength: 6, required: true },
    verificationCode: { type: String, required: false },
    verified: { type: Boolean, required: true, default: false },
    birthday: { Date },
    phone: { type: String },
    images: [{ type: Schema.Types.ObjectId, ref: "Image" }],
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }], // 賣場刊登的產品
    transactions: [{ type: Schema.Types.ObjectId, ref: "Transaction" }], // 交易記錄
    followedProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }], // 追蹤的商品
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
