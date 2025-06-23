const authRoutes = require("./authRoutes");
const paymentRoutes = require("./paymentRoutes");
const productRoutes = require("./productRoutes");
const imageRoutes = require("./imageRoutes");
const orderRoutes = require("./orderRoutes");
const sessionRoutes = require("./sessionRoutes");
const chatRoomRoutes = require("./chatRoomRoutes");
const userRoutes = require("./userRoutes");

function setupRoutes(app) {
  app.use("/api/auth", authRoutes); // 認證相關路由

  app.use("/api/products", productRoutes); // 商品相關路由

  app.use("/api/images", imageRoutes); // 圖片

  app.use("/api/orders", orderRoutes); // 訂單相關路由

  app.use("/api/payment", paymentRoutes); // 付款相關路由

  app.use("/api/session", sessionRoutes); // session

  app.use("/api/chat", chatRoomRoutes); // chatRoom

  app.use("/api/users", userRoutes); // user
}

module.exports = setupRoutes;
