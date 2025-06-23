const router = require("express").Router();
const { paymentController } = require("../controllers");
const { requireAuth } = require("../middlewares/auth");

// 接收金流 api 回傳結果
router.post("/result", paymentController.handlePaymentCallback);

// 取得付款 html
router.get("/:orderId", requireAuth, paymentController.getPaymentHtml);

module.exports = router;
