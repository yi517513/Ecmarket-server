const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    category: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    sortOrder: { type: Number, required: true, unique: true },
  },
  { timestamps: true }
);

// unique 真正的檢查，是由 MongoDB index 實現的
categorySchema.index({ category: 1 }, { unique: true });

const CategoryModel = mongoose.model("Category", categorySchema);
module.exports = { CategoryModel };
