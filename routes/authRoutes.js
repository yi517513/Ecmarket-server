const router = require("express").Router();
const { authController } = require("../controllers");
const { requireAuth, optionalAuth } = require("../middlewares/auth");

router.post("/login", authController.login);

router.post("/register", authController.register);

router.post("/send-code", authController.requestRegisterOtp);

router.post("/logout", requireAuth, authController.logout);

router.get("/me", optionalAuth, authController.checkMe);

module.exports = router;
