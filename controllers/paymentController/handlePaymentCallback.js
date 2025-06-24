const { validatePaymentCallback } = require("../../utils/adapters");
const { OrderModel } = require("../../models");
const { PaymentModel } = require("../../models");

const handlePaymentCallback = async (req, res, next) => {
  console.log("handlePaymentCallback");
  try {
    const paymentData = req.body;
    console.log(paymentData);
    const {
      CheckMacValue,
      CustomField1: orderId,
      CustomField2: buyer,
      CustomField3: seller,
      TradeAmt,
    } = paymentData || {};

    const checkValue = validatePaymentCallback(paymentData);
    if (CheckMacValue !== checkValue) throw new Error("金流Callback發生錯誤");

    await Promise.all([
      PaymentModel.create({ buyer, seller, orderId, TradeAmt }),
      OrderModel.updateOne({ _id: orderId }, { $set: { status: "paid" } }),
    ]);
  } catch (error) {
    console.error("Payment callback error:", error);
  } finally {
    // 交易成功後，需要回傳 1|OK 給綠界
    res.json("1|OK");
  }
};

module.exports = { handlePaymentCallback };
