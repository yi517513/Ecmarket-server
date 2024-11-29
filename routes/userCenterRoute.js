const router = require("express").Router();
const productsRoutes = require("./userCenter/productsRoutes");
const userRoutes = require("./userCenter/userRoutes");
const imageRoutes = require("./userCenter/imageRoute");
const transactionRoutes = require("./userCenter/transactionRoutes");

router.use("/transactions", transactionRoutes);
router.use("/products", productsRoutes);
router.use("/user", userRoutes);
router.use("/images", imageRoutes);

module.exports = router;
