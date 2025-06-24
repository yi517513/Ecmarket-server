const { HttpErrors } = require("../../errors/httpErrors");
const { OrderModel } = require("../../models");
const { ProductModel } = require("../../models");
const { paymentHtmlGenerator } = require("../../utils/adapters");

const createOrder = async (req, res, next) => {
  try {
    const currentUserId = req.user?._id;
    const { productId, quantity, price } = req.body || {};
    const totalAmount = price * quantity;

    const foundProduct = await ProductModel.findOne({ _id: productId });
    if (!foundProduct) throw HttpErrors.NotFound("找不到商品");

    if (Number(price) !== foundProduct.price) {
      throw HttpErrors.Conflict("商品資訊已更新", "CONFLICT_UPDATED");
    }
    const { title, category } = foundProduct;
    const newOrder = await OrderModel.create({
      buyer: currentUserId,
      seller: foundProduct.ownerId,
      productSnapshot: { productId, title, category },
      quantity: Number(quantity),
      totalAmount,
    });

    // 創建Ec-Pay支付頁面
    const paymentHtml = paymentHtmlGenerator({
      totalAmount,
      title,
      orderId: newOrder.id,
      buyer: currentUserId,
      seller: foundProduct.ownerId,
    });

    return res.status(200).json({ data: paymentHtml });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder };
