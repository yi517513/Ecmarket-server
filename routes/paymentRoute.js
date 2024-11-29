const router = require("express").Router();
const {
  getOrder,
  createOrder,
  deleteOrder,
} = require("../controllers/paymentController");

router.post("/createOrder", createOrder);

router.delete("/:transactionId", deleteOrder);

router.get("/:transactionId", getOrder);

// 驗證庫存路由 - 由後端發送的ejs對此路由發出請求並作為是否關閉的依據
// router.get()

module.exports = router;
