const router = require("express").Router();
const { paymentReturn } = require("../controllers/paymentController");
const {
  getAllPublicProducts,
  getPublicProductById,
} = require("../controllers/publicController");

// 公共路由 - 根據商品ID獲取詳情
router.get("/productDetail/:productId", getPublicProductById);

router.get("/", getAllPublicProducts);

router.get("/payment-return", paymentReturn);

module.exports = router;
