const passport = require("./jwtStrategy");
const { InternalServerError } = require("../../../errors/httpErrors");

const passport_Access = (req, res, next) => {
  passport.authenticate(
    "access-token-strategy",
    { session: false },
    (err, user) => {
      if (err) {
        res.clearCookie("refreshToken");
        res.clearCookie("accessToken");
        return res.status(500).send({ message: "Server error", data: null });
      }
      if (!user) {
        res.clearCookie("refreshToken");
        res.clearCookie("accessToken");
        return res.status(401).send({ message: "請重新登入", data: null });
      }
      req.user = user;
      next();
    }
  )(req, res, next);
};

const passport_Refresh = (req, res, next) => {
  passport.authenticate("jwt-strategy", { session: false }, (err, user) => {
    if (err) {
      res.clearCookie("jwt");
      return res.status(500).send({ message: "伺服器發生錯誤", data: null });
    }
    if (!user) {
      res.clearCookie("jwt");
      return res.status(401).send({ message: "請重新登入", data: null });
    }
    req.user = user;
    next();
  })(req, res, next);
};

const passport_checkStatus = (req, res, next) => {
  passport.authenticate("check-status", { session: false }, (err, user) => {
    if (err) {
      return res.status(500).send({ message: "伺服器發生錯誤", data: null });
    }
    if (!user) {
      return res
        .status(200)
        .send({ message: null, data: { isAuthenticated: false } });
    }
    req.user = user;
    next();
  })(req, res, next);
};

const authenticate = (type) => {
  switch (type) {
    case "access":
      return passport_Access;
    case "refresh":
      return passport_Refresh;
    case "optional":
      return passport_checkStatus;
    default:
      throw new InternalServerError("authenticate缺少參數");
  }
};
