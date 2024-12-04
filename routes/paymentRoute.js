const router = require("express").Router();
const {
  getOrderRedirectUrl,
  createPayment,
} = require("../controllers/paymentController");

router.post("/", createPayment);

router.get("/:paymentId", getOrderRedirectUrl);

module.exports = router;
