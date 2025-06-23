const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    // 100,000 + redis.incr ，100,015、100,016 開發用
    uid: { type: String, unique: true, index: true },
    username: { type: String, required: true },
    email: {
      type: String,
      minlength: 6,
      required: true,
      unique: true,
      index: true,
    },
    hashedPassword: { type: String, minlength: 6, required: true },
    // following: [{ type: String }],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    logoutAt: { type: Date, default: null },
    loginAt: { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret.__v;
    delete ret.hashedPassword;
    delete ret.updatedAt;
    delete ret.createdAt;

    return ret;
  },
});

const UserModel = mongoose.model("User", userSchema);
module.exports = { UserModel };
