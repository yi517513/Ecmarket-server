const authRoutes = require("./authRoutes");
const paymentRoutes = require("./paymentRoutes");
const productRoutes = require("./productRoutes");
const imageRoutes = require("./imageRoutes");
const systemMessageRoutes = require("./systemMessageRoute");
const orderRoutes = require("./orderRoutes");

function setupRoutes(app) {
  app.use("/api/auth", authRoutes); // 認證相關路由

  app.use("/api/product", productRoutes); // 商品相關路由

  app.use("/api/image", imageRoutes); // 圖片

  app.use("/api/order", orderRoutes); // 訂單相關路由

  app.use("/api/payment", paymentRoutes); // 付款相關路由

  app.use("/api/systemMessage", systemMessageRoutes); // systemMessage
}

module.exports = setupRoutes;
