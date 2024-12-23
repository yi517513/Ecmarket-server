const Transaction = require("../models/transactionModel");
const Product = require("../models/productModel");

// 待發貨的訂單
const getSellerPendingShipment = async (req, res) => {
  try {
    const userId = req.user.id;
    const pendingTransaction = await Transaction.find({
      seller: userId,
      shipmentStatus: "pending",
      receivedStatus: "pending",
    })
      .populate({ path: "product", select: "-_id" })
      .populate({ path: "buyer", select: "username" })
      .select("product buyer");

    if (!pendingTransaction) {
      return res.status(200).send({ message: null, data: null });
    }

    const pendingProducts = pendingTransaction.map((transaction) => ({
      ...transaction.product._doc,
      buyer: transaction.buyer,
      _id: transaction._id,
    }));

    return res.status(200).send({ message: null, data: pendingProducts });
  } catch (error) {
    console.error(error);
    return res.status(500).send("發生錯誤");
  }
};

// 出售歷史（已完成）
const getSellerSalesHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const foundTransaction = await Transaction.find({
      seller: userId,
      shipmentStatus: "completed",
      receivedStatus: "completed",
    })
      .populate({ path: "product", select: "-_id" })
      .populate({ path: "buyer", select: "username" })
      .select("product buyer");

    if (!foundTransaction) {
      return res.status(200).send({ message: null, data: null });
    }

    const completedProducts = foundTransaction.map((transaction) => ({
      ...transaction.product._doc,
      buyer: transaction.buyer,
      _id: transaction._id,
    }));

    return res.status(200).send({ data: completedProducts, message: null });
  } catch (error) {
    console.error(error);
    return res.status(500).send("發生錯誤");
  }
};

// 確認出貨（更新交易狀態）
const sellerConfirmShipment = async (req, res) => {
  const { transactionId } = req.params;

  try {
    const updateTransaction = await Transaction.findByIdAndUpdate(
      transactionId,
      { shipmentStatus: "completed" },
      { new: true }
    );
    if (!updateTransaction) {
      return res.status(404).send("沒有交易紀錄");
    }

    return res.status(200).send({ data: null, message: "出貨成功" });
  } catch (error) {
    console.error(error);

    return res.status(500).send("發生錯誤");
  }
};

module.exports = {
  getSellerPendingShipment,
  getSellerSalesHistory,
  sellerConfirmShipment,
};
