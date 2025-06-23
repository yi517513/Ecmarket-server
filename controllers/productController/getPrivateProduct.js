const { HttpErrors } = require("../../errors/httpErrors");
const { ProductModel } = require("../../models");

const getPrivateProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const currentUserId = req.user?._id;

    const foundProduct = await ProductModel.findOne({
      _id: productId,
      ownerId: currentUserId,
    }).select(
      "-__v -createdAt -followed -hasImages -ownerUid -soldAmount -updatedAt"
    );

    if (!foundProduct) throw HttpErrors.NotFound("找不到商品");

    return res.status(200).json({ message: null, data: foundProduct });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPrivateProduct };
