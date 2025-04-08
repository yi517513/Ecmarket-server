const imageRepository = require("../repository/imageRepository");
const {
  uploadImageToS3,
  deleteImageFromS3,
  generateImageUrl,
} = require("../helpers/s3Helper");
const { v4: uuidv4 } = require("uuid");
const { InternalServerError, NotFoundError } = require("../errors/httpErrors");

class ImageService {
  constructor(imageRepository) {
    this.imageRepo = imageRepository;
  }

  async saveImage({ file = {}, currentUserId }) {
    /*
      originalname - 原始檔案名稱
      mimetype - 檔案的 MIME 類型
      buffer - 一個 Node.js 的 Buffer 物件，內含整個上傳檔案的二進位資料，
      由於使用 memoryStorage，檔案不會寫入磁碟，而是暫存在記憶體中。    
    */
    if (!currentUserId) throw new InternalServerError("缺少使用者 ID");

    const { originalname, buffer, mimetype } = file;
    if (!originalname || !buffer || !mimetype) {
      throw new InternalServerError("缺少必要的檔案資訊");
    }

    const key = uuidv4() + "-" + originalname;

    await uploadImageToS3({ buffer, mimetype, key });

    // 創建新的圖片記錄
    await this.imageRepo.create({
      url: generateImageUrl(key),
      key,
      userId: currentUserId,
    });
  }

  async getImages({ currentUserId }) {
    if (!currentUserId) throw new InternalServerError("缺少使用者 ID");

    const foundImages = await this.imageRepo.findImagesByUser(currentUserId);

    return foundImages;
  }

  async deleteImage({ imageId, currentUserId }) {
    if (!imageId) throw new InternalServerError("缺少圖片 ID");
    if (!currentUserId) throw new InternalServerError("缺少使用者 ID");

    const deletedImage = await this.imageRepo.deleteImageById(
      currentUserId,
      imageId
    );

    if (!deletedImage) throw new NotFoundError("找不到指定圖片");

    await deleteImageFromS3({ key: deletedImage.key });
  }
}

const imageService = new ImageService(imageRepository);
module.exports = imageService;
