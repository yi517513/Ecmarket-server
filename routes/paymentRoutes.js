const router = require("express").Router();
const { paymentController } = require("../controllers");
const { requireAuth } = require("../middlewares/auth");

router.post("/", paymentController.handlePaymentCallback);

router.get("/:orderId", requireAuth, paymentController.getPaymentHtml);

module.exports = router;
