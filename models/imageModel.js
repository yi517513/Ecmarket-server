const mongoose = require("mongoose");
const { Schema } = mongoose;

const imageSchema = new Schema({
  url: { type: String, required: true },
  key: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  timestamp: { type: Date, default: Date.now },
});

const Image = mongoose.model("Image", imageSchema);
module.exports = Image;
