const router = require("express").Router();
const { handlePaymentCallback } = require("../controllers/paymentController");
const {
  getPublicProducts,
  getPublicProductById,
} = require("../controllers/publicController");

// 公共路由 - 根據商品ID獲取詳情
router.get("/:productId", getPublicProductById);

router.get("/", getPublicProducts);

router.post("/payment/callback", handlePaymentCallback);

module.exports = router;
