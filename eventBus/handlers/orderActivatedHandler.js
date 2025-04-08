const { eventEmitter } = require("../eventEmitter");
const transactionService = require("../../services/transactionService");
const systemMessageService = require("../../services/systemMessageService");
const socketService = require("../../services/socketService");
// const { notifyUser } = require("../helpers/notifyHelper");

module.exports = (io) => {
  eventEmitter.on("ORDER_ACTIVATED", async ({ buyer, seller, orderId }) => {
    const session = await transactionService.startSession();
    try {
      session.startTransaction();
      await Promise.all([
        systemMessageService.createMessage({
          targetId: buyer,
          content: `訂單編號: ${orderId}，已開啟交易，請聯繫賣家盡速發貨`,
          type: "PURCHASE",
          session,
        }),
        systemMessageService.createMessage({
          targetId: seller,
          content: `訂單編號: ${orderId}，買家已完成付款，請盡速發貨`,
          type: "PURCHASE",
          session,
        }),
      ]);
      await session.commitTransaction();
      notifyUser(buyer, io, socketService);
      notifyUser(seller, io, socketService);
    } catch (error) {
      console.error(error.message);
      await session?.abortTransaction();
      try {
        await systemMessageService.createMessage({
          targetId: buyer,
          content: `訂單編號: ${orderId}，發生異常，請聯繫客服`,
          type: "ERROR",
        });
        // notifyUser(buyer, io, socketService);
      } catch (msgError) {
        console.error("Failed to create error message:", msgError.message);
      }
    } finally {
      session?.endSession();
    }
  });
};
