const mongoose = require("mongoose");
const Product = require("../models/productModel");
const Transaction = require("../models/transactionModel");
const { sendMessageToRoom } = require("../sockets/socketService");
const ecpay_payment = require("ecpay_aio_nodejs");
const { MERCHANTID, HASHKEY, HASHIV, RETURN_URL, CLITEN_BACK_URL } =
  process.env;

const createOrder = async (req, res) => {
  const { owner, _id, price, amount, title } = req.body;
  const buyerId = req.user.id;
  const totalAmount = price * amount;

  const options = {
    OperationMode: "Test", //Test or Production
    MercProfile: {
      MerchantID: MERCHANTID,
      HashKey: HASHKEY,
      HashIV: HASHIV,
    },
    IgnorePayment: [
      // "Credit",
      // "WebATM",
      //    "ATM",
      //    "CVS",
      //    "BARCODE",
      //    "AndroidPay"
    ],
    IsProjectContractor: false,
  };
  let TradeNo;

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

  TradeNo = "test" + new Date().getTime();

  let base_param = {
    MerchantTradeNo: TradeNo, //請帶20碼uid, ex: f0a0d7e9fae1bb72bc93
    MerchantTradeDate,
    TotalAmount: totalAmount.toString(),
    TradeDesc: title,
    ItemName: title,
    ReturnURL: RETURN_URL,
    ClientBackURL: CLITEN_BACK_URL,
  };

  console.log(RETURN_URL);

  try {
    const create = new ecpay_payment(options);
    const paymentHtml = create.payment_client.aio_check_out_all(base_param);
    const transaction = new Transaction({
      buyerId,
      sellerId: owner._id,
      productId: _id,
      totalAmount,
      paymentHtml,
    });

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

const paymentReturn = async (req, res) => {
  const { CheckMacValue } = req.body;
  const data = { ...req.body };

  delete data.CheckMacValue; // 此段不驗證

  const create = new ecpay_payment(options);
  const checkValue = create.payment_client.helper.gen_chk_mac_value(data);

  console.log(
    "確認交易正確性：",
    CheckMacValue === checkValue,
    CheckMacValue,
    checkValue
  );

  // 交易成功後，需要回傳 1|OK 給綠界
  res.send("1|OK");
};

module.exports = {
  getOrder,
  createOrder,
  deleteOrder,
  paymentReturn,
};
