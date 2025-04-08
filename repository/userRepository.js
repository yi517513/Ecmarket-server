const BaseRepository = require("./baseRepository");
const userModel = require("../models/userModel");

class UserRepository extends BaseRepository {
  constructor(model) {
    super(model);
  }

  // 根據 username 搜尋用戶
  async findByUsername(username) {
    return await this.db.findOne({ username });
  }

  // 根據商品Id搜尋用戶
  async findByProduct(productId) {
    return await this.db
      .findOne({ products: { $in: [productId] } })
      .select("username email _id");
  }

  // 更新用戶錢包
  async updateWallet({ amount, userId, session }) {
    return await this.db.findOneAndUpdate(
      { _id: userId },
      { $inc: { wallet: amount } },
      { session, new: true }
    );
  }
}

const userRepository = new UserRepository(userModel);
module.exports = userRepository;
