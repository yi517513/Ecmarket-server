const { paymentHtmlGenerator } = require("../../utils/adapters");
const { OrderModel } = require("../../models");

const getPaymentHtml = async (req, res, next) => {
  try {
    const currentUserId = req.user?._id;
    const orderId = req.params?.orderId;

    const foundOrder = await OrderModel.findOne({
      _id: orderId,
      buyer: currentUserId,
    });

    // 創建Ec-Pay支付頁面
    const paymentHtml = paymentHtmlGenerator({
      totalAmount: foundOrder.totalAmount,
      title: foundOrder.productSnapshot.title,
      orderId,
      buyer: foundOrder.buyer,
      seller: foundOrder.seller,
    });

    return res.status(200).json({ data: paymentHtml });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPaymentHtml };
