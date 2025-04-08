const BaseRepository = require("./baseRepository");
const productModel = require("../models/productModel");

class ProductRepository extends BaseRepository {
  constructor(model) {
    super(model);
  }

  async findPublicProducts({ query = {} } = {}) {
    return await this.findAll(query);
  }

  async findSellerProducts(userId) {
    return await this.db.find({ "seller.userId": userId });
  }

  async findTrackingProducts(userId) {
    return await this.db.find({ followers: userId });
  }

  async findPublicProductById(productId) {
    return await this.db.findOne({ _id: productId });
  }

  async findPrivateProductById({ productId, ownerId }) {
    return await this.findByIdIfOwner({
      itemId: productId,
      owner: ownerId,
      ownerField: "seller.userId",
    });
  }

  async updateProductInfo({ productId, ownerId, updateData }) {
    return await this.updateByIdIfOwner({
      itemId: productId,
      updateFields: { $set: updateData },
      owner: ownerId,
      ownerField: "seller.userId",
    });
  }

  async addFollower({ productId, userId }) {
    return await this.updateOne({
      itemId: productId,
      updateFields: { $push: { followers: userId } },
    });
  }

  async removeFollower({ productId, userId }) {
    return await this.updateOne({
      itemId: productId,
      updateFields: { $pop: { followers: userId } },
    });
  }

  async deleteProduct({ productId, ownerId }) {
    await this.deleteByIdIfOwner({
      itemId: productId,
      owner: ownerId,
      ownerField: "seller.userId",
    });
  }
}

const productRepository = new ProductRepository(productModel);
module.exports = productRepository;

// async decInventory(productId, quantity, session) {
//   return await this.db.findOneAndUpdate(
//     { _id: productId },
//     { $inc: { inventory: -quantity } },
//     { new: true, session }
//   );
// }
