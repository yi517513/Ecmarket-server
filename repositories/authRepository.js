const userModel = require("../models/userModel");
const BaseRepository = require("./baseRepository");

class AuthRepository extends BaseRepository {
  constructor(model) {
    super(model);
  }

  /**
   * 根據 email 搜尋用戶
   * @param {string} email - 用戶的電子郵件地址
   * @returns {Promise<Object|null>} - 找到的用戶文件，找不到則回傳 null
   */
  async findByEmail(email) {
    return await this.findOne({ email });
  }
}

const authRepository = new AuthRepository(userModel);
module.exports = authRepository;
