const { default: mongoose } = require("mongoose");
const Transaction = require("../models/transactionModel");

const getAllTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const foundTransaction = await Transaction.find({
      $or: [{ buyerId: userId }, { sellerId: userId }],
    });
    if (!foundTransaction) {
      return res.status(404).send("沒有交易紀錄");
    }
    return res.status(200).send({ data: foundTransaction });
  } catch (error) {
    console.log(error);

    return res.status(500).send("發生錯誤");
  }
};

const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const foundTransaction = await Transaction.find({
      buyerId: userId,
      // paymentStatus: "pending",
      shipmentStatus: "pending",
    });
    if (!foundTransaction) {
      return res.status(404).send("沒有交易紀錄");
    }
    return res.status(200).send({ data: foundTransaction });
  } catch (error) {
    console.log(error);
    return res.status(500).send("發生錯誤");
  }
};

const getInProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    const foundTransaction = await Transaction.find({
      userId,
      paymentStatus: "completed",
      shipmentStatus: "pending",
    });
    if (!foundTransaction) {
      return res.status(404).send("沒有交易紀錄");
    }
    return res.status(200).send({ data: foundTransaction });
  } catch (error) {
    console.log(error);
    return res.status(500).send("發生錯誤");
  }
};

const getPendingShipment = async (req, res) => {
  try {
    const { userId } = req.params;
    const foundTransaction = await Transaction.find({
      sellerId: userId,
      paymentStatus: "completed",
      shipmentStatus: "pending",
    });
    if (!foundTransaction) {
      return res.status(404).send("沒有交易紀錄");
    }
    return res.status(200).send({ data: foundTransaction });
  } catch (error) {
    console.log(error);
    return res.status(500).send("發生錯誤");
  }
};

const confirmShipment = async (req, res) => {
  const { transactionId } = req.params;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const updateTransaction = await Transaction.findByIdAndUpdate(
      transactionId,
      {
        shipmentStatus: "completed",
      },
      { new: true }
    ).session(session);
    if (!updateTransaction) {
      await session.abortTransaction();
      return res.status(404).send("沒有交易紀錄");
    }

    await session.commitTransaction();
    console.log("出貨成功");
    return res.status(200).send({ message: "出貨成功" });
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    return res.status(500).send("發生錯誤");
  } finally {
    session.endSession();
  }
};

const getSoldHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const foundTransaction = await Transaction.find({
      sellerId: userId,
      paymentStatus: "completed",
      shipmentStatus: "completed",
    });
    if (!foundTransaction) {
      return res.status(404).send("沒有交易紀錄");
    }
    return res.status(200).send({ data: foundTransaction });
  } catch (error) {
    console.log(error);
    return res.status(500).send("發生錯誤");
  }
};

const getPurchasedHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const foundTransaction = await Transaction.find({
      buyerId: userId,
      paymentStatus: "completed",
      shipmentStatus: "completed",
    });
    if (!foundTransaction) {
      return res.status(404).send("沒有交易紀錄");
    }
    return res.status(200).send({ data: foundTransaction });
  } catch (error) {
    console.log(error);
    return res.status(500).send("發生錯誤");
  }
};

module.exports = {
  getAllTransactions,
  getOrders,
  getInProgress,
  getPendingShipment,
  confirmShipment,
  getPurchasedHistory,
  getSoldHistory,
};
