const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: { type: String, minlength: 3 },
    email: { type: String, minlength: 6, required: true, unique: true },
    password: { type: String, minlength: 6, required: true },
    role: { type: String, enum: ["buyer", "seller"], default: "buyer" },
    verificationCode: { type: String, required: false },
    veriftyed: { type: Boolean, required: true, default: false },
    birthday: { Date },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    phone: { type: String },
    address: { type: String },
    images: [{ type: Schema.Types.ObjectId, ref: "Image" }],
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }], // 賣場刊登的產品
    cart: [{ type: Schema.Types.ObjectId, ref: "Product" }], // 購物車
    transactions: [{ type: Schema.Types.ObjectId, ref: "Transaction" }], // 交易記錄
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
