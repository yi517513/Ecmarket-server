const router = require("express").Router();
const { orderController } = require("../controllers");
const { requireAuth } = require("../middlewares/auth");

// 訂單列表
router.get("/", requireAuth, orderController.getOrders);

// 建立商品訂單
router.post("/", requireAuth, orderController.createOrder);

// 取消訂單
router.delete("/:orderId", requireAuth, orderController.deletelOrder);

module.exports = router;
