const { OrderModel } = require("../../models");

const getOrderDetail = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const currentUserId = req.user?.id;

    const foundOrder = await OrderModel.findOne({
      _id: orderId,
      buyer: currentUserId,
    });

    return res.status(200).json({ data: foundOrder });
  } catch (error) {
    next(error);
  }
};

module.exports = { getOrderDetail };
