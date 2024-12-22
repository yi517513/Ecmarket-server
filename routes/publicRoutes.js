const router = require("express").Router();
const { handlePaymentCallback } = require("../controllers/paymentController");
const {
  getProducts,
  getProductById,
} = require("../controllers/productController");

// 公共路由 - 根據商品ID獲取詳情

router.get("/", getProducts);
router.get("/:productId", getProductById);

router.get("/shop/:userId", getProducts);

router.post("/payment-result", handlePaymentCallback);

module.exports = router;
