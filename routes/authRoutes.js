const router = require("express").Router();
const {
  register,
  login,
  sendVerificationCode,
  logout,
  checkStatus,
} = require("../controllers/authController");
const { authValidation } = require("../middlewares/validators/validations");

router.use(authValidation);

router.post("/login", login);

router.post("/register", register);

router.post("/send-code", sendVerificationCode);

router.post("/logout", logout);

router.get("/me", checkStatus);

module.exports = router;
