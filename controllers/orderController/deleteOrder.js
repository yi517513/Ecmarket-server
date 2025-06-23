const { OrderModel } = require("../../models");

const deletelOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const currentUserId = req.user?.id;

    await OrderModel.deleteOne({ _id: orderId, buyer: currentUserId });

    return res.status(200).json({ data: null, message: "成功取消訂單" });
  } catch (error) {
    next(error);
  }
};

module.exports = { deletelOrder };
