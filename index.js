require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const server = http.createServer(app);

const socketService = require("./services/socketService");
const io = socketService.initialize(server); // 伺服器端的單一實例，管理所有的用戶連接
const socket = require("./sockets/socket");

const passport = require("passport");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const userCenterRoutes = require("./routes/userCenterRoutes");
const publicRoutes = require("./routes/publicRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const path = require("path");

const { passport_Access, passport_Refresh } = require("./middlewares/passport");

const port = process.env.PORT || 8080; // process.env.PORT是Heroku自行動態設定

mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 30000, // 設置30秒超時
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log(error));

// 設置 cors 選項
const corsOptions = {
  origin: "http://localhost:4000", // 允許的來源網址
  methods: ["GET", "POST", "PATCH", "DELETE"], // 允許的 HTTP 方法
  allowedHeaders: ["Content-Type", "Authorization"], // 允許的頭部信息
  credentials: true, // 允許跨域設置 cookies
};

socket(io); // 用戶連接事件，獨立的socket實例是為每一個用戶單獨創建的

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(cookieParser()); // 解析 cookies
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors(corsOptions));

app.use(passport.initialize());

// 公共路由
app.use("/api", publicRoutes);
// 認證相關路由
app.use("/api/auth", authRoutes);
// 用戶中心相關路由
app.use("/api/userCenter", passport_Refresh, userCenterRoutes);
// 付款相關路由
app.use("/api/payment", passport_Access, paymentRoutes);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
