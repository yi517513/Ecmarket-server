const BaseRepository = require("./baseRepository");
const systemMessageModel = require("../models/systemMessageModel");

class SystemMessageRepository extends BaseRepository {
  constructor(model) {
    super(model);
  }

  async getSystemMessageByUserId(userId) {
    return await this.findAllIfOwner({
      owner: userId,
      ownerField: "targetId",
    }).select("-__v -targetId");
  }

  // 將 db 中符合 [messageId] 的系統訊息更新成 '已讀'
  async markSysMessageAsRead(messageIds) {
    return await this.db.updateMany(
      { _id: { $in: messageIds } }, // 查找 _id 在 messageIds 中的訊息
      { $set: { isRead: true } }
    );
  }
}

const systemMessageRepository = new SystemMessageRepository(systemMessageModel);
module.exports = systemMessageRepository;
