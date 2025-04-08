const transctionRepository = require("../repository/transactionRepository");
const { InternalServerError } = require("../errors/httpErrors");

class TransactionService {
  constructor(transctionRepository) {
    this.transactionRepo = transctionRepository;
  }

  async executeTransaction(transactionFn) {
    let session, result;
    try {
      session = await transactionService.startSession();
      session.startTransaction();

      // 執行的業務邏輯
      await transactionFn(session);

      await session.commitTransaction();
      result = "SUCCESS";
    } catch (error) {
      await session?.abortTransaction();
      console.error("executeTransaction錯誤：", error);
      result = "ERROR";
    } finally {
      session?.endSession();
      return result;
    }
  }

  async createTransfer({ payment, session }) {
    if (!Object.keys(payment).length)
      throw new InternalServerError("缺少Payment資訊");
    if (!session) throw new InternalServerError("缺少sesion參數");
    if (!type) throw new InternalServerError("缺少操作類型");

    const { _id, payer, payee, totalAmount } = payment;

    await this.transactionRepo.createTransaction({
      transactionInfo: {
        payer,
        payee,
        payment: _id,
        amount: totalAmount,
        transactionType: "transfer",
      },
      session,
    });
  }

  async createRefund({ payment, session }) {}
}

const transactionService = new TransactionService(transctionRepository);

module.exports = transactionService;
