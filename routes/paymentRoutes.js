const router = require("express").Router();
const { getOrderRedirectUrl } = require("../controllers/paymentController");

router.get("/:orderId", getOrderRedirectUrl);

module.exports = router;
