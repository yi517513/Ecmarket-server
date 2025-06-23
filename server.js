require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);

const connectMongoDB = require("./config/database");
const Socket = require("./config/socket");

const sockets = require("./sockets");
const eventBus = require("./events");

const setupMiddlewares = require("./middlewares");
const setupRoutes = require("./routes");
const setupErrorHandler = require("./errors");

async function startServer() {
  try {
    await connectMongoDB(); //  MongoDB 連線

    const io = Socket.initialize(server); // 獲取 socket 實例
    sockets(io); // 註冊 socket
    eventBus(io); // 註冊 eventBus

    setupMiddlewares(app); // 設置中間件
    setupRoutes(app); // 設置路由
    setupErrorHandler(app); // 設置錯誤處理

    const port = process.env.PORT || 8080; // process.env.PORT是Heroku自行動態設定
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("伺服器啟動失敗:", error);
    process.exit(1);
  }
}

startServer();
