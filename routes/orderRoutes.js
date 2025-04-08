const router = require("express").Router();
const {
  getOrders,
  getOrderDetail,
  createOrder,
  cancelOrder,
} = require("../controllers/orderController");

router.get("/", getOrders);

router.get("/:orderId", getOrderDetail);

router.post("/", createOrder);

router.delete("/:orderId", cancelOrder);

module.exports = router;
