const productRepository = require("../repository/productRepository");
const { InternalServerError } = require("../errors/httpErrors");

class ProductService {
  constructor(productRepository) {
    this.productRepo = productRepository;
  }

  async getProducts({ type, targetUserId, currentUserId }) {
    switch (type) {
      case "public":
        return await this.productRepo.findPublicProducts();
      case "user":
        if (!targetUserId) throw new InternalServerError("缺少目標對象 ID");
        return await this.productRepo.findPublicProducts({
          query: { "seller.userId": targetUserId },
        });
      case "tracking":
        console.log("tracking");
        if (!currentUserId) throw new InternalServerError("缺少使用者 ID");
        return await this.productRepo.findTrackingProducts(currentUserId);
      case "seller":
        if (!currentUserId) throw new InternalServerError("缺少使用者 ID");
        return await this.productRepo.findSellerProducts(currentUserId);
      default:
        throw new InternalServerError("無效類型");
    }
  }

  async getProduct({ type, productId, currentUserId }) {
    if (!productId) throw new InternalServerError("缺少商品 ID");

    switch (type) {
      case "public":
        return await this.productRepo.findPublicProductById(productId);
      case "private":
        if (!currentUserId) throw new InternalServerError("缺少使用者 ID");
        return await this.productRepo.findPrivateProductById({
          productId,
          ownerId: currentUserId,
        });
      default:
        throw new InternalServerError("無效類型");
    }
  }

  async postProduct({ productInfo = {}, currentUserId, currentUsername }) {
    if (!currentUserId || !currentUsername)
      throw new InternalServerError("缺少使用者資訊");

    const { title, price, inventory, images, description } = productInfo;
    if (!title || !price || !inventory || !description || !images)
      throw new InternalServerError("缺少商品資訊");

    const newProduct = await this.productRepo.create({
      title,
      price,
      inventory,
      description,
      images,
      seller: { userId: currentUserId, username: currentUsername },
    });

    return newProduct._id;
  }

  async updateProduct({ updateInfo = {}, productId, currentUserId }) {
    if (!currentUserId) throw new InternalServerError("缺少使用者 ID");
    if (!productId) throw new InternalServerError("缺少商品 ID");

    const { title, price, inventory, images, description } = updateInfo;
    if (!title || !price || !inventory || !description || !images)
      throw new InternalServerError("缺少商品資訊");

    const updatedProduct = await this.productRepo.updateProductInfo({
      productId,
      ownerId: currentUserId,
      updateData: { title, price, inventory, images, description },
    });

    return updatedProduct._id;
  }

  async trackProduct({ productId, currentUserId }) {
    if (!productId) throw new InternalServerError("缺少商品 ID");
    if (!currentUserId) throw new InternalServerError("缺少用戶 ID");

    await this.productRepo.addFollower({ productId, userId: currentUserId });
  }

  async deleteTracking({ productId, currentUserId }) {
    if (!productId) throw new InternalServerError("缺少商品 ID");
    if (!currentUserId) throw new InternalServerError("缺少用戶 ID");

    await this.productRepo.removeFollower({ productId, userId: currentUserId });
  }

  async deleteProduct({ productId, currentUserId }) {
    if (!currentUserId) throw new InternalServerError("缺少使用者 ID");
    if (!productId) throw new InternalServerError("缺少商品 ID");

    await this.productRepo.deleteProduct({ productId, ownerId: currentUserId });
  }
}

const productService = new ProductService(productRepository);
module.exports = productService;
