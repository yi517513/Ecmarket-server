const Payment = require("../models/paymentModel");
const Product = require("../models/productModel");
const Transaction = require("../models/transactionModel");
const User = require("../models/userModel");
const { sendMessageToRoom } = require("../sockets/socketService");
const {
  ecCreatePayment,
  validatePaymentCallback,
} = require("../utils/ecpayHelper");

// 立即購買
const createPayment = async (req, res) => {
  const { owner: seller, _id: product, price, amount, title } = req.body;
  const buyer = req.user.id;
  const totalAmount = price * amount;
  const TradeNo = "test" + new Date().getTime();

  try {
    await User.updateOne(
      { _id: buyer },
      { $push: { followedProducts: product } }
    );
    await Product.updateOne({ _id: product }, { $inc: { followerCount: 1 } });

    const newPayment = new Payment({
      amount,
      totalAmount,
      product,
    });

    // 使用 ecCreatePayment 創建支付頁面
    const paymentHtml = ecCreatePayment({
      TradeNo,
      TotalAmount: totalAmount,
      TradeDesc: title,
      ItemName: title,
      CustomField1: newPayment._id.toString(),
      CustomField2: buyer.toString(),
      CustomField3: seller.toString(),
    });

    const redirectUrl = `${req.protocol}://${req.get("host")}/api/payment/${
      newPayment._id
    }`;

    newPayment.paymentHtml = paymentHtml.toString();

    await newPayment.save();

    return res.status(200).send({ data: redirectUrl, message: null });
  } catch (error) {
    console.log(error);
    res.status(500).send("創建訂單時發生錯誤");
  }
};

const getOrderRedirectUrl = async (req, res) => {
  const { paymentId } = req.params;

  try {
    // 獲取訂單紀錄
    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).send("找不到交易紀錄");
    }

    const paymentHtml = payment.paymentHtml;

    return res.status(200).render("index", {
      title: "EC-pay",
      paymentHtml,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("伺服器發生錯誤");
  }
};

const handlePaymentCallback = async (req, res) => {
  console.log(`接收金流callback`);
  const { CheckMacValue } = req.body;
  const data = { ...req.body };

  delete data.CheckMacValue; // 測試版加入CheckMacValue驗證會錯誤

  const checkValue = validatePaymentCallback(data);

  // 交易正確性為true
  if (CheckMacValue === checkValue) {
    const paymentId = data.CustomField1;
    const buyer = data.CustomField2;
    const seller = data.CustomField3;

    console.log(`paymentId: ${paymentId}`);
    console.log(`buyer: ${buyer}`);
    console.log(`seller: ${seller}`);

    try {
      const payment = await Payment.findById(paymentId);
      if (!payment) {
        return res.status(404).send("找不到payment");
      }

      // 更新payment的paymentStatus
      const paymentPromise = Payment.findOneAndUpdate(
        { _id: paymentId },
        { paymentStatus: "completed" },
        { new: true }
      ).exec();

      const transactionPromise = new Transaction({
        buyer,
        seller,
        product: payment.product,
        payment: paymentId,
      }).save();

      // 更新Product的inventory
      const productPromise = Product.updateOne(
        { _id: payment.product },
        { $inc: { inventory: -payment.amount, soldAmount: payment.amount } } // 使用 $inc 來遞減庫存
      ).exec();

      await Promise.all([paymentPromise, transactionPromise, productPromise]);
    } catch {
      console.log("資料轉換或保存資料時發生錯誤:", error);
    }
  }

  // 交易成功後，需要回傳 1|OK 給綠界
  res.send("1|OK");
};

module.exports = { createPayment, getOrderRedirectUrl, handlePaymentCallback };
