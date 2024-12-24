const Payment = require("../models/paymentModel");
const {
  transferToPayer,
  markPaymentTransferred,
} = require("../utils/paymentHandler");
const sendSystemMessage = require("../utils/systemMessageHelper");

// 買家獲取付款收據，用以決定是否開啟交易
const getPreTransactions = async (req, res) => {
  console.log("using getPreTransactions");
  try {
    const userId = req.user.id;
    const payments = await Payment.find({
      payer: userId,
      paymentType: "purchase",
      paymentStatus: "completed",
      isTransferred: false,
    })
      .populate({ path: "product", select: "-_id -owner -__v" })
      .select("-paymentHtml -__v");

    const processedPayments = payments
      .map((payment) => {
        if (!payment.product || payment.itemPrice != payment.product.price) {
          // 發送通知
          sendSystemMessage({
            targetId: payment.payer,
            targetRoute: "/user-center/buyer/pre-transaction",
            type: "error",
            option: { itemTitle: payment.itemTitle },
          });
          // 退回款項
          transferToPayer(payment.payer, payment.totalAmount);
          // 標記款項已轉移
          markPaymentTransferred(payment);
          // 返回無效結果
          return null;
        } else {
          return {
            // 返回有效的處理結果
            ...payment.product._doc,
            seller: payment.payee,
            totalAmount: payment.totalAmount,
            _id: payment._id,
          };
        }
      })
      .filter((payment) => payment !== null); // 過濾掉無效的支付記錄

    console.log(processedPayments);

    return res.status(200).send({ message: null, data: processedPayments });
  } catch (error) {
    console.error(error);
    return res.status(500).send("發生錯誤");
  }
};

// 根據payment開啟交易
const createPreTransaction = async (req, res) => {
  try {
    const userId = req.user.id;

    return res.status(200).send({ message: null, data: null });
  } catch (error) {
    console.error(error);
    return res.status(500).send("發生錯誤");
  }
};

// 根據payment取消交易 - 錢退回至錢包
const cancelPreTransaction = async (req, res) => {
  try {
    const userId = req.user.id;

    return res.status(200).send({ message: null, data: null });
  } catch (error) {
    console.error(error);
    return res.status(500).send("發生錯誤");
  }
};

module.exports = {
  getPreTransactions,
  createPreTransaction,
  cancelPreTransaction,
};
