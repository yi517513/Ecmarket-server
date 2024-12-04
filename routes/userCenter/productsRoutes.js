const router = require("express").Router();
const {
  postProduct,
  getProductForEdit,
  editProduct,
} = require("../../controllers/productController");
const validators = require("../../middlewares/validator");

// 新增商品
router.post("/", validators.publish, postProduct);

// 獲取商品用於更新
router.get("/:productId", getProductForEdit);

// 更新商品
router.patch("/:productId", editProduct);

module.exports = router;
