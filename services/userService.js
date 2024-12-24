const User = require("../models/userModel");

class UserService {
  constructor(User) {
    this.db = User;
  }

  printAllUser() {
    console.log(this.userSockets);
    console.log(`=====================================================`);
  }

  async getUser(userId) {
    try {
      const user = await this.db.findById(userId);

      return user;
    } catch (error) {
      console.error(
        `獲取對象資料失敗 - userId: ${userId}, 原因: ${error.message}`
      );
      throw new Error("獲取對象資料失敗");
    }
  }

  async getUsername(userId) {
    try {
      const receiverName = await this.db
        .findById(userId)
        .select("username -_id");

      return receiverName;
    } catch (error) {
      console.error(
        `獲取對象資料失敗 - userId: ${userId}, 原因: ${error.message}`
      );
      throw new Error("獲取對象資料失敗");
    }
  }

  async getUserWallet(userId) {
    try {
      const user = await this.db.findById(userId).select("wallet -_id");

      return user.wallet;
    } catch (error) {
      console.error(error.message);
      throw new Error("getUserWallet發生錯誤");
    }
  }
}
const userService = new UserService(User); // 確保只有一個實例
module.exports = userService;
