const orderService = require("../services/orderService");

// 獲取訂單 - 未付款
const getOrders = async (req, res, next) => {
  try {
    const { status, role } = req.query;
    const currentUserId = req.user?.id;

    const foundOrders = await orderService.getOrders({
      status,
      role,
      currentUserId,
    });

    return res.status(200).send({ data: foundOrders, message: null });
  } catch (error) {
    next(error);
  }
};

// 獲取訂單 - 未付款
const getOrderDetail = async (req, res, next) => {
  try {
    const { role } = req.query;
    const { orderId } = req.params;
    const currentUserId = req.user?.id;

    const orders = await orderService.getOrderDetail({
      role,
      orderId,
      currentUserId,
    });

    return res.status(200).send({ data: orders, message: null });
  } catch (error) {
    next(error);
  }
};

const createOrder = async (req, res, next) => {
  try {
    const { seller, ...orderInfo } = req.body;
    const currentUserId = req.user?.id;

    const foundOrders = await orderService.createOrder({
      seller,
      orderInfo,
      currentUserId,
    });

    return res.status(200).send({ data: foundOrders, message: null });
  } catch (error) {
    next(error);
  }
};

// 刪除訂單 - 未付款
const cancelOrder = async (req, res, next) => {
  try {
    const { role } = req.query;
    const { orderId } = req.params;
    const currentUserId = req.user?.id;

    await orderService.cancelOrder({ role, orderId, currentUserId });

    return res.status(200).send({ data: null, message: "成功取消訂單" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrders,
  getOrderDetail,
  createOrder,
  cancelOrder,
};
