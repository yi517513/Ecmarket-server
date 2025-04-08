const BaseRepository = require("./baseRepository");
const transactionModel = require("../models/transactionModel");

class TransactionRepository extends BaseRepository {
  constructor(model) {
    super(model);
  }

  async startSession() {
    return await this.db.startSession();
  }

  async createTransaction({ transactionInfo, session }) {
    await this.db.create(transactionInfo, { session });
  }
}

const transactionRepository = new TransactionRepository(transactionModel);
module.exports = transactionRepository;
