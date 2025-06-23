const { HttpErrors } = require("../../errors/httpErrors");
const { ProductModel } = require("../../models");

const updateProduct = async (req, res, next) => {
  try {
    const updateInfo = req.body;

    const { productId } = req.params;
    const currentUserId = req.user?._id;

    const updatedProduct = await ProductModel.findOneAndUpdate(
      { _id: productId, ownerId: currentUserId },
      { ...updateInfo },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) throw HttpErrors.NotFound("找不到商品");

    const { category } = updatedProduct || {};

    return res
      .status(200)
      .json({ data: { productId, category }, message: "成功更新商品" });
  } catch (error) {
    next(error);
  }
};

module.exports = { updateProduct };
