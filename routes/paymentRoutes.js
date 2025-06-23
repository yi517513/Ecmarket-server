const router = require("express").Router();
const { paymentController } = require("../controllers");

router.post("/", paymentController.handlePaymentCallback);

module.exports = router;
