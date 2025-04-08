const userModel = require("../models/userModel");
const BaseRepository = require("../repository/baseRepository");

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

  /**
   * 更新用戶的登出時間
   * @param {string} userId - 用戶的 ID
   * @param {string} email - 用戶的 email（所有者驗證）
   * @returns {null>}
   */
  async updateLogoutTime(userId) {
    const date = new Date();

    await this.db.updateOne({ userId }, { $set: { lastLogoutTime: date } });
  }

  /**
   * 更新用戶的登入時間
   * @param {string} userId - 用戶的 ID
   * @returns {Promise<Object|null>} - 更新後的用戶文件，若找不到則回傳 null
   */
  async updateLoginTime(userId) {
    const date = new Date();

    return await this.db.findOneAndUpdate(
      { userId },
      { $set: { lastLoginTime: date } },
      {
        new: true,
        projection: {
          _id: 0,
          __v: 0,
          email: 0,
          createdAt: 0,
          updatedAt: 0,
          verified: 0,
          password: 0,
          wallet: 0,
        },
      }
    );
  }

  /**
   * 若該 email 尚未註冊，則建立暫時帳號並設定驗證碼與過期時間
   * @param {string} email - 用戶的 email
   * @param {string} verificationCode - 驗證碼
   * @returns {null>}
   */
  async prepareVerificationCodeRecord(email, verificationCode) {
    await this.db.updateOne(
      { email },
      { verificationCode, expiresAt: new Date(Date.now() + 3 * 60 * 1000) }, // 設定 3 分鐘後過期
      { upsert: true, setDefaultsOnInsert: true }
    );
  }

  /**
   * 根據 JWT 搜尋用戶 (用於 refresh token 的驗證)
   * 當某裝置登出後，其餘裝置的 refresh token 皆失效
   * @param {Object} params
   * @param {string} params.userId - 用戶 ID
   * @param {string} params.email - 用戶信箱（用作所有者驗證）
   * @param {Date} params.jwtLastLogoutTime - JWT 中解析出的最後登出時間
   * @returns {Promise<Object|null>} - 符合條件的用戶文件，否則回傳 null
   */
  async findByRefreshJwt({ userId, email, jwtLastLogoutTime }) {
    return await this.db
      .findOne({ _id: userId, email, lastLogoutTime: jwtLastLogoutTime })
      .select("-__v -password -verified");
  }

  /**
   * 根據 JWT 搜尋用戶 (用於 access token 的驗證)
   * 只有最新登入的 token 有效
   * @param {Object} params
   * @param {string} params.userId - 用戶 ID
   * @param {string} params.email - 用戶信箱（用作所有者驗證）
   * @param {Date} params.jwtLastLogoutTime - JWT 中解析出的最後登出時間
   * @param {Date} params.jwtLastLoginTime - JWT 中解析出的最後登入時間
   * @returns {Promise<Object|null>} - 符合條件的用戶文件，否則回傳 null
   */
  async findByAccessJwt({
    userId,
    email,
    jwtLastLogoutTime,
    jwtLastLoginTime,
  }) {
    return await this.db
      .findOne({
        _id: userId,
        email,
        lastLogoutTime: jwtLastLogoutTime,
        lastLoginTime: jwtLastLoginTime,
      })
      .select("-__v -password -verified");
  }
}

const authRepository = new AuthRepository(userModel);
module.exports = authRepository;
