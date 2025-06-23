const router = require("express").Router();
const { systemMessageController } = require("../controllers");
const { requireAuth } = require("../middlewares/auth");

router.get("/", requireAuth, systemMessageController.getMessage);

module.exports = router;
