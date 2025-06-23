const { ProductModel } = require("../../models");

const createProduct = async (req, res, next) => {
  try {
    const currentUserId = req.user?._id;
    const productInfo = req.body;

    const newProduct = await ProductModel.create({
      ...productInfo,
      ownerId: currentUserId,
    });

    const { category, _id: productId } = newProduct || {};

    res
      .status(201)
      .json({ data: { productId, category }, message: "成功新增商品" });
  } catch (error) {
    next(error);
  }
};

module.exports = { createProduct };
