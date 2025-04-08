const paymentService = require("../services/paymentService");
const orderService = require("../services/orderService");

const getOrderRedirectUrl = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;

    const foundOrder = await orderService.getOrderDetail({
      role: "buyer",
      orderId,
      userId,
    });

    const paymentHtml = await paymentService.generateEcPayPaymentPage({
      order: foundOrder,
    });

    return res.status(200).send({ data: paymentHtml, message: null });
  } catch (error) {
    next(error);
  }
};

const handlePaymentCallback = async (req, res, next) => {
  try {
    await paymentService.handlePaymentCallback({ body: req.body });
  } catch (error) {
    console.error("Payment callback error:", error);
  } finally {
    // 交易成功後，需要回傳 1|OK 給綠界
    res.send("1|OK");
  }
};

module.exports = { getOrderRedirectUrl, handlePaymentCallback };
