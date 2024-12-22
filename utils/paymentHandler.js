const User = require("../models/userModel");
const Product = require("../models/productModel");
const sendSystemMessage = require("./systemMessageHelper");
const messageGenerator = require("./generateMessageHelper");

const handleTopUp = async (payment, payerId, totalAmount) => {
  try {
    // user wallet更新
    const user = await User.findOneAndUpdate(
      { _id: payerId },
      { $inc: { wallet: totalAmount } },
      { new: true }
    );

    // 生成socket訊息
    const topUpMsg = messageGenerator({
      userId: payerId,
      username: user.username,
      targetRoute: "UserWallet",
    });

    // 發送通知
    sendSystemMessage({
      targetId: payerId,
      content: topUpMsg,
      targetRoute: "UserWallet",
    });

    // 更新payment狀態
    payment.isTransferred = "completed";
    await payment.save();
  } catch (error) {
    throw new Error(`handleTopUp發生錯誤:${handleTopUp}`);
  }
};

const handlePurchase = async (payment, payerId, totalAmount) => {
  try {
    const product = await Product.findById(payment.product.productId);

    if (!product) {
      // 商品已刪除 - 退款到用戶錢包
      await User.updateOne({ _id: payerId }, { $inc: { wallet: totalAmount } });
      payment.isTransferred = "completed";
      await payment.save();
      return;
    }

    // 商品未刪除 - 通知買方
    const purchaseMsg = messageGenerator({
      userId: payerId,
      username: payment.username, // 確保有username
      targetRoute: "/user-center/buyer/transactions/open",
    });
    sendSystemMessage({
      targetId: payerId,
      content: purchaseMsg,
      targetRoute: "/user-center/buyer/transactions/open",
    });

    // 減少商品庫存
    product.inventory -= payment.product.quantity;
    await product.save();

    // payment.isTransferred將在transaction階段更新
  } catch (error) {
    throw new Error(`handlePurchase發生錯誤:${handleTopUp}`);
  }
};

module.exports = { handleTopUp, handlePurchase };
