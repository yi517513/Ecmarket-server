const Product = require("../models/productModel");
const Transaction = require("../models/transactionModel");
const User = require("../models/userModel");

const getBuyerCartItems = async (req, res) => {
  try {
    const userId = req.user.id;

    // 查詢使用者的followedProducts
    const user = await User.findById(userId).select("followedProducts");
    console.log(user);
    if (!user || !user.followedProducts || user.followedProducts.length === 0) {
      return res.status(200).send({ message: null, data: null });
    }

    const followedProductIds = user.followedProducts;

    // 根據ID查詢商品詳細
    const followedProducts = await Product.find({
      _id: { $in: followedProductIds },
    });

    console.log(followedProducts);

    return res.status(200).send({ message: null, data: followedProducts });
  } catch (error) {
    console.log(error);
    return res.status(500).send("發生錯誤");
  }
};

// 加入追蹤商品
const addToBuyerCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { _id } = req.body;

    await Promise.all([
      User.updateOne({ _id: userId }, { $push: { followedProducts: _id } }),
      Product.updateOne({ _id }, { $inc: { followerCount: 1 } }),
    ]);

    return res.status(200).send({ message: "成功追蹤商品", data: null });
  } catch (error) {
    console.log(error);
    return res.status(500).send("發生錯誤");
  }
};

// 刪除追蹤商品
const deleteBuyerCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    await Promise.all([
      User.updateOne(
        { _id: userId },
        { $pull: { followedProducts: productId } }
      ),
      Product.updateOne({ _id: productId }, { $inc: { followerCount: -1 } }),
    ]);

    return res.status(200).send({ message: "成功移除追蹤商品", data: null });
  } catch (error) {
    console.log(error);
    return res.status(500).send("發生錯誤");
  }
};

// 買家待收貨
const getBuyerAwaitingShipment = async (req, res) => {
  try {
    const userId = req.user.id;

    const pendingTransaction = await Transaction.find({
      buyer: userId,
      shipmentStatus: "pending",
    });

    if (!pendingTransaction) {
      return res.status(200).send({ message: null, data: null });
    }

    const pendingProductIds = pendingTransaction.product;

    const pendingProducts = await Product.find({
      _id: { $in: pendingProductIds },
    });

    console.log(pendingProducts);

    return res.status(200).send({ message: null, data: pendingProducts });
  } catch (error) {
    console.log(error);
    return res.status(500).send("發生錯誤");
  }
};

// 買家購買紀錄
const getBuyerPurchaseHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const foundTransaction = await Transaction.find({
      buyerId: userId,
      shipmentStatus: "completed",
    });

    if (!foundTransaction) {
      console.log("沒有交易紀錄");
      return res.status(200).send({ message: null, data: null });
    }

    return res.status(200).send({ data: foundTransaction, message: null });
  } catch (error) {
    console.log(error);
    return res.status(500).send("發生錯誤");
  }
};

module.exports = {
  getBuyerCartItems,
  addToBuyerCart,
  deleteBuyerCartItem,
  getBuyerAwaitingShipment,
  getBuyerPurchaseHistory,
};
