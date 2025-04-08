const router = require("express").Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  createTracking,
  deleteTracking,
} = require("../controllers/productController");

const { productValidation } = require("../middlewares/validators/validations");

router.use(productValidation);

router.get("/", getProducts); // 所有商品 - 首頁、用戶

router.get("/private", getProducts); // 賣家、追蹤

router.get("/:productId", getProduct); // 商品詳情

router.get("/private/:productId", getProduct); // 編輯頁面用

router.post("/", createProduct); // 發布商品

router.patch("/:productId", updateProduct); // 更新商品

router.delete("/:productId", deleteProduct); // 刪除商品

router.post("/:productId/tracking", createTracking); // 追蹤商品

router.delete("/:productId/tracking", deleteTracking); // 移除追蹤

module.exports = router;
