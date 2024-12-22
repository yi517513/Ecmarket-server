const Transaction = require("../models/transactionModel");

// // 買家待收貨
// const getBuyerAwaitingShipment = async (req, res) => {
//   console.log(`getBuyerAwaitingShipment`);
//   try {
//     const userId = req.user.id;

//     const awaitingTransaction = await Transaction.find({
//       buyer: userId,
//       shipmentStatus: "pending",
//     }).populate("product");

//     if (!awaitingTransaction) {
//       return res.status(200).send({ message: null, data: null });
//     }

//     const awaitingProducts = awaitingTransaction.map(
//       (transaction) => transaction.product
//     );

//     return res.status(200).send({ message: null, data: awaitingProducts });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send("發生錯誤");
//   }
// };

// // 買家待領收
// const getBuyerAwaitingConfirm = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const awaitingTransaction = await Transaction.find({
//       buyer: userId,
//       shipmentStatus: "completed",
//       receivedStatus: "pending",
//     })
//       .populate({ path: "product", select: "-_id -owner" })
//       .select("product seller");

//     if (!awaitingTransaction) {
//       return res.status(200).send({ message: null, data: null });
//     }

//     const awaitingProducts = awaitingTransaction.map((transaction) => ({
//       ...transaction.product._doc,
//       seller: transaction.seller,
//       _id: transaction._id,
//     }));

//     return res.status(200).send({ message: null, data: awaitingProducts });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send("發生錯誤");
//   }
// };

// // 買家購買紀錄
// const getBuyerPurchaseHistory = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const foundTransaction = await Transaction.find({
//       buyer: userId,
//       shipmentStatus: "completed",
//       receivedStatus: "completed",
//     })
//       .populate({ path: "product", select: "-_id" })
//       .select("product");

//     if (!foundTransaction) {
//       return res.status(200).send({ message: null, data: null });
//     }

//     const completedProducts = foundTransaction.map((transaction) => ({
//       ...transaction.product._doc,
//       seller: transaction.product.owner,
//       _id: transaction._id,
//     }));

//     return res.status(200).send({ data: completedProducts, message: null });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send("發生錯誤");
//   }
// };

// // 確認出貨（更新交易狀態）
// const BuyerConfirmReceived = async (req, res) => {
//   const { transactionId } = req.params;

//   try {
//     const updateTransaction = await Transaction.findByIdAndUpdate(
//       transactionId,
//       { receivedStatus: "completed" },
//       { new: true }
//     );
//     if (!updateTransaction) {
//       return res.status(404).send("沒有交易紀錄");
//     }

//     return res.status(200).send({ data: null, message: "領收成功" });
//   } catch (error) {
//     console.log(error);

//     return res.status(500).send("發生錯誤");
//   }
// };
