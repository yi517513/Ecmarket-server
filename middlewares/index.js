const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// 設置 cors 選項
const corsOptions = {
  origin: ["http://localhost:4000", "http://localhost:5173"], // 允許的來源網址
  methods: ["GET", "POST", "PATCH", "DELETE"], // 允許的 HTTP 方法
  allowedHeaders: ["Content-Type", "Authorization"], // 允許的頭部信息
  credentials: true, // 允許跨域設置 cookies
};

function setupMiddlewares(app) {
  app.use(cookieParser()); // 解析 cookies
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use(cors(corsOptions)); // 處理跨域
}

module.exports = setupMiddlewares;
