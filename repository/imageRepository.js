const imageModel = require("../models/imageModel");

class ImageRepository {
  constructor(model) {
    this.db = model;
  }

  /**
   * 根據 userId 搜尋圖片
   * @param {string} userId - 用戶的 ID
   * @returns {Promise<Object|null>} - 找到的圖片文件，僅保留 `url` 與 `timestamp` 欄位，找不到則回傳 null
   */
  async findImagesByUser(userId) {
    return await this.db.find({ userId }).select("-key -userId -__v");
  }

  /**
   * 根據用戶 ID 和圖片 ID 刪除圖片
   * @param {string} userId - 用戶的 ID
   * @param {string} imageId - 圖片的 ID
   * @returns {Promise<Object|null>} - 回傳被刪除的圖片文件，若圖片不存在或刪除失敗則回傳 null
   */
  async deleteImageById(userId, imageId) {
    return await this.db.findOneAndDelete({ _id: imageId, userId });
  }
}

const imageRepository = new ImageRepository(imageModel);
module.exports = imageRepository;
