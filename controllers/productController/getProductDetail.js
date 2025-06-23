const { HttpErrors } = require("../../errors/httpErrors");
const { ProductModel } = require("../../models");

const getProductDetail = async (req, res, next) => {
  try {
    const { productId } = req.params;
    // console.log(productId);

    const foundProduct = await ProductModel.findOne({ _id: productId });
    if (!foundProduct) throw new HttpErrors.NotFound("找不到商品");

    return res.status(200).json({ message: null, data: foundProduct });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProductDetail };
