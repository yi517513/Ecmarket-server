const BaseRepository = require("./baseRepository");
const paymentModel = require("../models/paymentModel");

class PaymentRepository extends BaseRepository {
  constructor(model) {
    super(model);
  }

  async getPendingTransactions(userId) {
    return await this.db
      .find({
        payer: userId,
        paymentType: "purchase",
        paymentStatus: "completed",
        transferStatus: "pending",
      })
      .populate({ path: "product", select: "-seller -__v" })
      .select("-paymentHtml -__v")
      .lean();
  }
}

const paymentRepository = new PaymentRepository(paymentModel);
module.exports = paymentRepository;
