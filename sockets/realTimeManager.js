const User = require("../models/userModel");
const SystemMessage = require("../models/systemMessageModel");

class RealTimeManager {
  constructor(User, SystemMessage) {
    this.user = User;
    this.sys = SystemMessage;
  }

  async getUserWallet(userId) {
    try {
      const user = await this.user.findById(userId);

      return user;
    } catch (error) {
      console.error(error.message);
      throw new Error("getUserWallet發生錯誤");
    }
  }

  // 獲取用戶資訊 - 系統資訊、錢包
  async getSystemMessages(userId) {
    try {
      const messages = await this.sys.getMessages(userId);
      console.log(`messages:${messages}`);

      const transformedMessages = messages.map(({ _id, ...rest }) => ({
        messageId: _id.toString(),
        ...rest,
      }));

      console.log(transformedMessages);

      return transformedMessages;
    } catch (error) {
      console.error(error.message);
      throw new Error("getSystemMessages發生錯誤");
    }
  }

  async handleInit(userId) {
    try {
      const [user, messages] = await Promise.all([
        this.getUserWallet(userId),
        this.getSystemMessages(userId),
      ]);

      const wallet = user.wallet;

      return { wallet, messages };
    } catch (error) {
      console.error(error.message);
      throw new Error("handleInit發生錯誤");
    }
  }

  async handleUpdateMessages(messageIds) {
    try {
      const result = await this.sys.updateMessages(
        { _id: { $in: messageIds } },
        { $set: { isRead: true } }
      );
      return result;
    } catch (error) {
      console.error("handleUpdateReadStatus失敗:", error.message);
      throw new Error("更新已讀狀態失敗");
    }
  }
}
const realTimeManager = new RealTimeManager(User, SystemMessage);
module.exports = realTimeManager;
