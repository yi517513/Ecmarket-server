const passport = require("../config/passportStrategies");

const passport_Local = (req, res, next) => {
  passport.authenticate(
    "local-strategy",
    { session: false },
    (err, user, info) => {
      if (err) {
        console.log(`passport_Refresh err: ${err}`);
        return res.status(500).send({ message: "Server error", data: null });
      }
      if (!user) {
        // 驗證失敗，沒有用戶
        return res.status(401).send({ message: "信箱或密碼錯誤", data: null });
      }
      req.user = user;
      next();
    }
  )(req, res, next);
};

const passport_Access = (req, res, next) => {
  passport.authenticate(
    "access-token-strategy",
    { session: false },
    (err, user, info) => {
      if (err) {
        console.log(`passport_Refresh err: ${err}`);
        return res.status(500).send({ message: "Server error", data: null });
      }
      if (!user) {
        res.clearCookie("refreshToken");
        res.clearCookie("accessToken");
        return res
          .status(401)
          .send({ message: "Token失效，請重新登入", data: null });
      }
      req.user = user;
      next();
    }
  )(req, res, next);
};

const passport_Refresh = (req, res, next) => {
  passport.authenticate(
    "refresh-token-strategy",
    { session: false },
    (err, user, info) => {
      if (err) {
        console.log(`passport_Refresh err: ${err}`);
        return res.status(500).send({ message: "Server error", data: null });
      }
      if (!user) {
        res.clearCookie("refreshToken");
        res.clearCookie("accessToken");
        return res.status(401).send({ message: null, data: null });
      }
      req.user = user;
      next();
    }
  )(req, res, next);
};

module.exports = { passport_Local, passport_Access, passport_Refresh };
