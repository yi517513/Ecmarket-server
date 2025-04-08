const BaseRepository = require("./baseRepository");
const tradeMessage = require("../models/tradeMessageModal");

class TradeMessageRepo extends BaseRepository {
  constructor(model) {
    super(model);
  }

  async getMessagesById(orderId) {
    return await this.findAllIfOwner({
      owner: orderId,
      ownerField: "orderId",
    })
      .select("-__v")
      .sort({ timestamp: 1 });
  }
}

const tradeMessageRepo = new TradeMessageRepo(tradeMessage);
module.exports = tradeMessageRepo;
