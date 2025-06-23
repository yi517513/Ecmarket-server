const mongoose = require("mongoose");
const { Schema } = mongoose;

const imageSchema = new Schema({
  url: { type: String, required: true },
  key: { type: String, required: true },
  ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const ImageModel = mongoose.model("Image", imageSchema);
module.exports = { ImageModel };
