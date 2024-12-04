const router = require("express").Router();
const productsRoutes = require("./userCenter/productsRoutes");
const userRoutes = require("./userCenter/userRoutes");
const imageRoutes = require("./userCenter/imageRoute");
const buyerRoutes = require("./userCenter/buyerRoutes");
const sellerRoutes = require("./userCenter/sellerRoutes");

// 買家相關操作
router.use("/buyer", buyerRoutes);

// 賣家相關操作
router.use("/seller", sellerRoutes);

router.use("/products", productsRoutes);
router.use("/user", userRoutes);
router.use("/images", imageRoutes);

module.exports = router;
