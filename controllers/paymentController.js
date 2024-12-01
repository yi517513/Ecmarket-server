const mongoose = require("mongoose");
const Product = require("../models/productModel");
const Transaction = require("../models/transactionModel");
const { sendMessageToRoom } = require("../sockets/socketService");
const ecpay_payment = require("ecpay_aio_nodejs");
const { MERCHANTID, HASHKEY, HASHIV, RETURN_URL, CLITEN_BACK_URL } =
  process.env;

const ecpayOptions = {
  OperationMode: "Test", // Test or Production
  MercProfile: {
    MerchantID: MERCHANTID,
    HashKey: HASHKEY,
    HashIV: HASHIV,
  },
  IgnorePayment: [], // Disabled payment methods (if any)
  IsProjectContractor: false,
};

const MerchantTradeDate = new Date().toLocaleString("zh-TW", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
  timeZone: "UTC",
});

const createOrder = async (req, res) => {
  const { owner, _id, price, amount, title, images } = req.body;
  const buyerId = req.user.id;
  const totalAmount = price * amount;
  let TradeNo;

  TradeNo = "test" + new Date().getTime();

  try {
    const transaction = new Transaction({
      buyerId,
      sellerId: owner._id,
      productId: _id,
      image: images[0],
      amount,
      totalAmount,
    });

    let base_param = {
      MerchantTradeNo: TradeNo, //請帶20碼uid, ex: f0a0d7e9fae1bb72bc93
      MerchantTradeDate,
      TotalAmount: totalAmount.toString(),
      TradeDesc: title,
      ItemName: title,
      ReturnURL: RETURN_URL,
      ClientBackURL: CLITEN_BACK_URL,
      // NeedExtraPaidInfo: "Y",
      CustomField1: transaction._id.toString(),
      CustomField2: transaction.amount.toString(),
    };

    const create = new ecpay_payment(ecpayOptions);
    const paymentHtml = create.payment_client.aio_check_out_all(base_param);

    transaction.paymentHtml = paymentHtml;

    await transaction.save();

    const redirectUrl = `${req.protocol}://${req.get("host")}/api/payment/${
      transaction._id
    }`;

    return res.status(200).send({ data: redirectUrl, message: null });
  } catch (error) {
    console.log(error);
    res.status(500).send("創建訂單時發生錯誤");
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { transactionId } = req.params;
    await Transaction.findByIdAndDelete(transactionId);
    return res.status(200).send({ message: "成功刪除訂單" });
  } catch (error) {
    console.log(error);
    return res.status(500).send("伺服器發生錯誤");
  }
};

const getOrder = async (req, res) => {
  const { transactionId } = req.params;

  try {
    // 獲取訂單紀錄
    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return res.status(404).send("找不到交易紀錄");
    }

    const paymentHtml = transaction.paymentHtml;

    return res.status(200).render("index", {
      title: "EC-pay",
      paymentHtml,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("伺服器發生錯誤");
  }
};

const paymentResult = async (req, res) => {
  console.log("req.body:", req.body);

  const { CheckMacValue } = req.body;
  const data = { ...req.body };

  delete data.CheckMacValue; // 測試版加入CheckMacValue驗證會錯誤

  const create = new ecpay_payment(ecpayOptions);
  const checkValue = create.payment_client.helper.gen_chk_mac_value(data);

  console.log(data);

  // 交易正確性為true
  if (CheckMacValue === checkValue) {
    const transactionId = data.CustomField1;
    const amount = data.CustomField2;

    // 更新transaction的paymentStatus
    const transaction = await Transaction.findOneAndUpdate(
      { _id: transactionId },
      { paymentStatus: "completed" },
      { new: true }
    );
    // 更新Product的inventory
    await Product.findOneAndUpdate(
      { _id: transaction.productId },
      { $inc: { inventory: -amount, pendingShipment: amount } } // 使用 $inc 來遞減庫存
    );
  }

  // 交易成功後，需要回傳 1|OK 給綠界
  res.send("1|OK");
};

module.exports = {
  getOrder,
  createOrder,
  deleteOrder,
  paymentResult,
};
