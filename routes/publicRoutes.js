const router = require("express").Router();
const { paymentResult } = require("../controllers/paymentController");
const {
  getAllPublicProducts,
  getPublicProductById,
} = require("../controllers/publicController");

// 公共路由 - 根據商品ID獲取詳情
router.get("/productDetail/:productId", getPublicProductById);

router.get("/", getAllPublicProducts);

router.post("/payment-result", paymentResult);

module.exports = router;
