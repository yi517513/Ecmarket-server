const notificationMediator = require("../mediators/NotificationMediator");

class PaymentManager {
  constructor(userModel, productModel, systemMessageHelper, platformId) {
    this.user = userModel;
    this.product = productModel;
    this.sendSystemMessage = systemMessageHelper;
    this.platformId = platformId;
  }

  async transferToPayer(payerId, totalAmount) {
    try {
      await this.user.updateOne(
        { _id: payerId },
        { $inc: { wallet: totalAmount } }
      );
    } catch (error) {
      console.error(
        `transferToPayer發生錯誤 ，(payerIdId: ${payerId}):`,
        error.message
      );
      throw new Error(`轉移款項給用戶失敗`);
    }
  }

  async transferToPlatform(totalAmount) {
    try {
      await this.user.updateOne(
        { _id: platformId },
        { $inc: { wallet: totalAmount } }
      );
    } catch (error) {
      console.error(
        `transferToPlatform發生錯誤，(platformId: ${platformId}):`,
        error.message
      );
      throw new Error(`轉移款項給平台失敗`);
    }
  }

  async markPaymentTransferred(payment) {
    try {
      payment.isTransferred = true;
      await payment.save();
    } catch (error) {
      console.error(
        `markPaymentTransferred發生錯誤，(paymentId: ${payment._id}):`,
        error.message
      );
      throw new Error(`更新付款紀錄的isTransferred失敗`);
    }
  }

  async handleTopUp(payment, payerId, totalAmount) {
    try {
      this.transferToPayer(payerId, totalAmount);
      this.transferToPlatform(totalAmount);
      // 發送通知
      notificationMediator.dispatchSystemMessage({});
      sendSystemMessage({
        targetId: payerId,
        targetRoute: "/user-center/user/wallet",
      });

      // 更新payment狀態
      markPaymentTransferred(payment);
    } catch (error) {
      console.error("handleTopUp發生錯誤:", error.message);
      throw new Error("handleTopUp發生錯誤");
    }
  }

  async handlePurchase(payment, payerId, totalAmount) {
    try {
      const product = await Product.findById(payment.product);

      // 商品已刪除
      if (!product) {
        // 將款項退回給付款者
        transferToPayer(payerId, payment, totalAmount);
        transferToPlatform(payment, totalAmount);
        markPaymentTransferred(payment);
      }

      sendSystemMessage({
        targetId: payerId,
        targetRoute: "/user-center/buyer/pre-transaction",
      });

      // 減少商品庫存
      product.inventory -= payment.itemQuantity;
      await product.save();

      // payment.isTransferred將在transaction階段更新
    } catch (error) {
      console.error("handlePurchase發生錯誤:", error.message);
      throw new Error("handlePurchase發生錯誤");
    }
  }
}

module.exports = PaymentManager;
