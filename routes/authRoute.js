const router = require("express").Router();
const {
  register,
  login,
  sendVerifyCode,
  refreshAccessToken,
  logout,
  checkAuth,
} = require("../controllers/authController");
const { passport_Refresh, passportLocal } = require("../middlewares/passport");
const validators = require("../middlewares/validator");

router.use("/", (req, res, next) => {
  next();
});

router.post("/register", validators.register, register);

router.post("/login", validators.login, passportLocal, login);

router.post("/logout", logout);

router.post("/sendVerifyCode", sendVerifyCode);

// 根據refressToken生命週期刷新accessToken(防止CSRF用)
// 前後端資料存取時使用的是accessToken來驗證
router.post("/refreshAccessToken", passport_Refresh, refreshAccessToken);

router.get("/checkAuth", passport_Refresh, checkAuth);

module.exports = router;
