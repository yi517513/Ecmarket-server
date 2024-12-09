const Transaction = require("../models/transactionModel");
const Product = require("../models/productModel");

const getSellerProducts = async (req, res) => {
  console.log(`getSellerProducts`);
  try {
    const { id } = req.user;

    // 查詢用戶所有商品
    const foundProducts = await Product.find({ "owner.userId": id });

    console.log(foundProducts);

    // 查詢每個商品是否有未完成交易
    const productsWithPendingStatus = await Promise.all(
      foundProducts.map(async (product) => {
        const hasPendingTransactions = await Transaction.exists({
          productId: product._id,
          shipmentStatus: "pending",
        });

        return {
          ...product.toObject(),
          hasPending: !!hasPendingTransactions,
        };
      })
    );

    console.log(productsWithPendingStatus);

    return res.send({ message: null, data: productsWithPendingStatus });
  } catch (error) {
    return res.status(500).send("伺服器發生錯誤");
  }
};

// 待發貨的訂單
const getSellerPendingShipment = async (req, res) => {
  console.log(`getSellerPendingShipment `);
  try {
    const { userId } = req.params;
    const foundTransaction = await Transaction.find({
      sellerId: userId,
      shipmentStatus: "pending",
    }).populate("productId", ["title", "images"]);

    if (!foundTransaction) {
      return res.status(404).send("沒有交易紀錄");
    }
    return res.status(200).send({ data: foundTransaction });
  } catch (error) {
    console.log(error);
    return res.status(500).send("發生錯誤");
  }
};

// 出售歷史（已完成）
const getSellerSalesHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const foundTransaction = await Transaction.find({
      sellerId: userId,
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

// 確認出貨（更新交易狀態）
const sellerConfirmShipment = async (req, res) => {
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

module.exports = {
  getSellerProducts,
  getSellerPendingShipment,
  getSellerSalesHistory,
  sellerConfirmShipment,
};
