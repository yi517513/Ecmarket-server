const systemMessageRepository = require("../repository/systemMessageRepository");
const { InternalServerError } = require("../errors/httpErrors");

class SystemMessageService {
  constructor(systemMessageRepository) {
    this.systemMsgRepo = systemMessageRepository;
  }

  // sys : 儲存系統訊息
  async saveSystemMessage({ targetId, content, type }) {
    if (!targetId) throw new InternalServerError("缺少目標 ID");
    if (!content) throw new InternalServerError("缺少訊息資訊");
    if (!type) throw new InternalServerError("缺少訊息類型");

    return await this.systemMsgRepo.create({ targetId, content, type });
  }

  async createPaymentMessage({ payment = {}, type }) {
    if (!Object.keys(payment).length)
      throw new InternalServerError("缺少Payment資訊");
    if (!type) throw new InternalServerError("缺少訊息類型");

    try {
      const { _id, payer, amount, paymentType, order } = payment;

      const contentMapping = {
        SUCCESS: {
          topUp: `儲值成功，金額: ${amount}，系統將更新您的錢包`,
          purchase: `付款成功，訂單編號: ${order}，請至開啟交易頁面開啟交易程序`,
        },
        ERROR: {
          topUp: `儲值失敗，收據編號: ${_id}，請聯繫客服`,
          purchase: `購買失敗，收據編號: ${_id}，請聯繫客服`,
        },
      };

      await this.saveSystemMessage({
        targetId: payer,
        content: contentMapping[paymentType],
        type,
      });
    } catch (error) {
      console.error("createPaymentMessage錯誤：", error);
      // 補救機制
    }
  }

  // sys : 獲取系統訊息
  async getSystemMessages({ currentUserId }) {
    if (!currentUserId) throw new InternalServerError("缺少用戶 ID");

    return await this.systemMsgRepo.getSystemMessageByUserId(currentUserId);
  }

  // sys : 更新系統訊息未讀狀態
  async updateSystemMessageStatus(messageIds) {
    const result = await this.systemMsgRepo.markSysMessageAsRead(messageIds);

    return result;
  }
}

const systemMessageService = new SystemMessageService(systemMessageRepository);
module.exports = systemMessageService;
