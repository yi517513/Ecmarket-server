const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    userId: { type: Number, unique: true, index: true },
    username: { type: String, required: true },
    email: {
      type: String,
      minlength: 6,
      required: true,
      unique: true,
      index: true,
    },
    password: { type: String, minlength: 6, required: true },
    wallet: { type: Number, default: 0 },
    lastLogoutTime: { type: Date, default: null },
    lastLoginTime: { type: Date, default: null },
    expiresAt: { type: Date, index: { expires: 0 } }, // TTL Index
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
