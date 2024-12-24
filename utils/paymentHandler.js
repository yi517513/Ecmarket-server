const User = require("../models/userModel");
const Product = require("../models/productModel");
const sendSystemMessage = require("./systemMessageHelper");

const platformId = "6763f4d87f613773c6f1fca4";

const transferToPayer = async (payerId, totalAmount) => {
  try {
    await User.updateOne({ _id: payerId }, { $inc: { wallet: totalAmount } });
  } catch (error) {
    console.error(
      `transferToPayer發生錯誤 ，(payerIdId: ${payerId}):`,
      error.message
    );
    throw new Error(`轉移款項給用戶失敗`);
  }
};

const transferToPlatform = async (totalAmount) => {
  try {
    await User.updateOne(
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
};

const markPaymentTransferred = async (payment) => {
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
};

const handleTopUp = async (payment, payerId, totalAmount) => {
  console.log(`執行 handleTopUp`);
  try {
    transferToPayer(payerId, totalAmount);
    transferToPlatform(totalAmount);
    // 發送通知
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
};

const handlePurchase = async (payment, payerId, totalAmount) => {
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
};

module.exports = {
  transferToPayer,
  transferToPlatform,
  transferToManyPayers,
  markPaymentTransferred,
  handleTopUp,
  handlePurchase,
};
