const router = require("express").Router();
const {
  postProduct,
  getUserProducts,
  getProductById,
  editProduct,
  deleteProduct,
} = require("../../controllers/productController");
const validators = require("../../middlewares/validator");

// 新增
router.post("/", validators.publish, postProduct);

// 獲取使用者所有商品
router.get("/", getUserProducts);

// 根據ID獲取商品
router.get("/:productId", getProductById);

// 更新
router.patch("/:productId", editProduct);

// 刪除
router.delete("/:productId", deleteProduct);

module.exports = router;
