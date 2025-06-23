const { OrderModel } = require("../../models");
const { ProductModel } = require("../../models");
const { paymentHtmlGenerator } = require("../../utils/adapters");

const createOrder = async (req, res, next) => {
  try {
    const currentUserId = req.user?._id;
    const { productId, quantity } = req.body || {};

    const foundProduct = await ProductModel.findOne({ _id: productId });
    if (!foundProduct) return res.status(404).json({ message: "商品不存在" });
    const { title, category, price } = foundProduct;
    const totalAmount = price * quantity;

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
