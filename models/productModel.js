const mongoose = require("mongoose");
const { Schema } = mongoose;

// 定義 imageSnapshot 的子 schema
const imageSnapshotSchema = new Schema(
  {
    _id: { type: String, required: true }, // 保留為 string，因為不是 ref
    url: { type: String, required: true },
    ownerId: { type: String, required: true }, // 同上
    timestamp: { type: Date, required: true },
    createdAt: { type: Date, required: true },
  },
  { _id: false } // 不自動產生 _id
);

const productSchema = new Schema(
  {
    title: { type: String, minlength: 3 },
    price: { type: Number, required: true },
    inventory: { type: Number, required: true },
    description: { type: String, required: true },
    images: { type: [imageSnapshotSchema] },
    hasImages: { type: Boolean, default: false },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    followed: { type: Number, default: 0 },
    soldAmount: { type: Number, default: 0 },
    category: { type: String, required: true },
    productType: {
      type: String,
      enum: ["account", "item", "money"],
      required: true,
    },
  },
  { timestamps: true }
);

//  create（save）時設定 hasImages
productSchema.pre("validate", function (next) {
  this.hasImages = Array.isArray(this.images) && this.images.length > 0;
  next();
});

// update（findOneAndUpdate）時同步 hasImages
productSchema.pre("findOneAndUpdate", function (next) {
  // 取得這次更新操作中欲更新的內容（可能是直接設值，也可能是使用 $set）
  const update = this.getUpdate();

  // 嘗試取得 images 欄位的更新值
  const newImages = update.images || (update.$set && update.$set.images);

  // 如果這次更新有指定 images 欄位
  if (newImages) {
    // 確保 $set 存在（因為 Mongoose 的更新語法可能沒包在 $set 裡）
    if (!update.$set) update.$set = {};
    // 根據 images 陣列是否為陣列且有內容，設定 hasImages 欄位（true 或 false）
    update.$set.hasImages = Array.isArray(newImages) && newImages.length > 0;
  }
  next();
});

const ProductModel = mongoose.model("Product", productSchema);
module.exports = { ProductModel };
