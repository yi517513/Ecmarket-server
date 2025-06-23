const { HttpErrors } = require("../../errors/httpErrors");
const { ProductModel } = require("../../models");

const deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const currentUserId = req.user?._id;

    const deletedProduct = await ProductModel.findOneAndDelete({
      _id: productId,
      ownerId: currentUserId,
    });

    if (!deletedProduct) throw HttpErrors.NotFound("找不到商品");

    return res.status(200).json({ data: null, message: "成功刪除商品" });
  } catch (error) {
    next(error);
  }
};

module.exports = { deleteProduct };
