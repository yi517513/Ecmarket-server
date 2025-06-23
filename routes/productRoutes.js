const router = require("express").Router();
const { productContoller } = require("../controllers");
const { requireAuth } = require("../middlewares/auth");

// PUBLIC
router.get("/category/:category", productContoller.getPublicProducts);
router.get("/single/:productId", productContoller.getProductDetail);

// PRIVATE - 需登入
router.get("/private", requireAuth, productContoller.getPrivateProducts);
router.get(
  "/private/:productId",
  requireAuth,
  productContoller.getPrivateProduct
);

// CUD
router.post("/", requireAuth, productContoller.createProduct);
router.patch("/:productId", requireAuth, productContoller.updateProduct);
router.delete("/:productId", requireAuth, productContoller.deleteProduct);

module.exports = router;
