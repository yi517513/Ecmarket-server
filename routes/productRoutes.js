const router = require("express").Router();
const {
  getProducts,
  getProductById,
  postProduct,
  editProduct,
  deleteProduct,
} = require("../controllers/productController");
const validators = require("../middlewares/validator");

// Product
router.get("/", getProducts); // 獲取賣家所有商品
router.post("/", validators.postProduct, postProduct); // 新增商品
router.get("/:productId", getProductById); // 獲取商品用於更新
router.patch("/:productId", editProduct); // 更新商品
router.delete("/:productId", deleteProduct); // 刪除商品

module.exports = router;
