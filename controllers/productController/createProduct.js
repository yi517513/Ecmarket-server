const { HttpErrors } = require("../../errors/httpErrors");
const { ProductModel } = require("../../models");

const createProduct = async (req, res, next) => {
  try {
    const productInfo = req.body;
    const currentUserId = req.user?._id;

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
