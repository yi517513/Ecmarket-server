const { eventEmitter } = require("../eventEmitter");

const transactionService = require("../../services/transactionService");
const systemMessageService = require("../../services/systemMessageService");
const userService = require("../../services/userService");
const socketService = require("../../services/socketService");

const { InternalServerError } = require("../../errors/httpErrors");

module.exports = () => {
  eventEmitter.on("PAYMENT_SUCCESS", async ({ payment, paymentType }) => {
    if (paymentType !== "topUp" || paymentType !== "purchase") {
      throw new InternalServerError("錯誤付款類型");
    }

    let result;

    if (paymentType === "topUp") {
      result = await transactionService.executeTransaction(async (session) => {
        await Promise.all([
          transactionService.createTransfer({ payment, session }),
          userService.updateUserWallet({ payment, session }),
        ]);
      });
    }

    // 若 paymentType 為 "purchase"，不進入交易邏輯，但後續流程仍然執行

    await systemMessageService.createPaymentMessage({ payment, type: result });

    socketService.notifyUser(payment?.payer);
  });
};
