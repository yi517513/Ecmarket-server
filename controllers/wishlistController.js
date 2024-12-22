const Product = require("../models/productModel");
const User = require("../models/userModel");

// 獲取追蹤列表商品
const getWishlistItems = async (req, res) => {
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

// 加入商品到追蹤列表
const addItemToWishlist = async (req, res) => {
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

// 刪除追蹤列表指定商品
const deleteItemFromWishlist = async (req, res) => {
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

module.exports = {
  getWishlistItems,
  addItemToWishlist,
  deleteItemFromWishlist,
};
