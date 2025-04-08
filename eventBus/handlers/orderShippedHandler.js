const { eventEmitter } = require("../eventEmitter");
const transactionService = require("../../services/transactionService");
const systemMessageService = require("../../services/systemMessageService");
const socketService = require("../../services/socketService");
// const { notifyUser } = require("../helpers/notifyHelper");

module.exports = (io) => {
  eventEmitter.on("ORDER_SHIPPED", async ({ buyer, seller, orderId }) => {
    const session = await transactionService.startSession();
    try {
      session.startTransaction();
      await systemMessageService.createMessage({
        targetId: buyer,
        content: `訂單編號: ${orderId}，賣家已確認發貨，請盡速領收`,
        type: "PURCHASE",
        session,
      });
      await session.commitTransaction();
      notifyUser(buyer, io, socketService);
    } catch (error) {
      console.error(error.message);
      await session?.abortTransaction();
      try {
        await systemMessageService.createMessage({
          targetId: seller,
          content: `訂單編號: ${orderId}，發生異常，請聯繫客服`,
          type: "ERROR",
        });
        // notifyUser(seller, io, socketService);
      } catch (msgError) {
        console.error("Failed to create error message:", msgError.message);
      }
    } finally {
      session?.endSession();
    }
  });
};
