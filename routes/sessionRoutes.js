const router = require("express").Router();
const { sessionController } = require("../controllers");
const { requireAuth } = require("../middlewares/auth");

router.get("/", requireAuth, sessionController.getUserSession);

module.exports = router;
