const router = require("express").Router();
const profileRoutes = require("./profileRoutes");
const preTransactionRoutes = require("./preTransactionRoutes");
const productRoutes = require("./productRoutes");
const imageRoutes = require("./imageRoutes");
const wishlistRoutes = require("./wishlistRoutes");

// 付款完成後相關操作
router.use("/pre-transaction", preTransactionRoutes);

// 商品相關操作
router.use("/product", productRoutes);

// 用戶相關操作
router.use("/profile", profileRoutes);

// 圖片
router.use("/image", imageRoutes);

// Wishlist
router.use("/wishlist", wishlistRoutes);

module.exports = router;
