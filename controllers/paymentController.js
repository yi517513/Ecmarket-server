const Payment = require("../models/paymentModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const {
  validatePaymentCallback,
  generatePaymentHtml,
  generateRedirectUrl,
} = require("../utils/ecpayHelper");
const { handleTopUp, handlePurchase } = require("../utils/paymentHandler");

// 立即購買
const createPayment = async (req, res) => {
  try {
    const { type } = req.query;
    const payer = req.user.id;
    // 檢查是否為有效的類型
    if (!["topUp", "purchase"].includes(type)) {
      return res.status(400).send({ message: "無效的查詢類型", data: null });
    }

    let redirectUrl;
    let newPayment;

    switch (type) {
      case "topUp":
        // 儲值到平台
        const { topUpCash } = req.body;
        newPayment = new Payment({
          payer,
          payee: "67512543a648b2a9c3b8f9bd",
          paymentType: "topUp",
          totalAmount: topUpCash,
        });

        const paymentHtmlTopUp = generatePaymentHtml({
          totalAmount: topUpCash,
          title: `平台儲值 ${topUpCash} 元`,
          paymentId: newPayment._id.toString(),
          payer,
          payee: "67512543a648b2a9c3b8f9bd",
        });

        newPayment.paymentHtml = paymentHtmlTopUp.toString();
        redirectUrl = generateRedirectUrl(newPayment._id, req);

        await newPayment.save();
        break;
      case "purchase":
        const { payee, productId, price, quantity, title } = req.body;

        const totalAmount = price * quantity;

        await User.updateOne(
          { _id: payer },
          { $push: { followedProducts: productId } }
        );
        await Product.updateOne(
          { _id: productId },
          { $inc: { followerCount: 1 } }
        );

        newPayment = new Payment({
          payer,
          payee,
          paymentType: "purchase",
          product: { productId: _id, quantity },
          totalAmount,
        });

        // 使用 ecCreatePayment 創建支付頁面
        const paymentHtmlBuy = generatePaymentHtml({
          totalAmount,
          title,
          paymentId: newPayment._id.toString(),
          payer,
          payee,
        });

        newPayment.paymentHtml = paymentHtmlBuy.toString();
        redirectUrl = generateRedirectUrl(newPayment._id, req);

        await newPayment.save();
        break;
    }

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
    const payer = data.CustomField2;
    const payee = data.CustomField3;

    try {
      const payment = await Payment.findOneAndUpdate(
        { _id: paymentId },
        { paymentStatus: "completed" },
        { new: true }
      );
      const paymentType = payment.paymentType;
      const totalAmount = payment.totalAmount;

      console.log(`payer: ${payer}`);
      console.log(`totalAmount: ${totalAmount}`);

      switch (paymentType) {
        case "topUp":
          await handleTopUp(payment, payer, totalAmount);
          break;
        case "purchase":
          await handlePurchase(payment, payer, totalAmount);
          break;
      }
    } catch (error) {
      console.error("資料轉換或保存資料時發生錯誤:", error.message);
    }
  }
  // 交易成功後，需要回傳 1|OK 給綠界
  res.send("1|OK");
};

module.exports = { createPayment, getOrderRedirectUrl, handlePaymentCallback };
