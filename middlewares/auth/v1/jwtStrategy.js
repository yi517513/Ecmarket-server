const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const { cookieExtractor } = require("../../../helpers/cookieHelper");
const authService = require("../../../services/authService");
const sessionEvents = require("../../../eventBus/emitters/sessionEvents");

/*
jwt_payload 是解析成功後的 payload 內容。
解析不出的話，Passport 內部會自動攔截錯誤，
不會進入 try...catch 區塊，而是直接返回 Unauthorized（401）
*/

// Access Token
const opts_access = {
  // 從req.header中獲取token的方式改為從cookie
  jwtFromRequest: cookieExtractor("access"),
  secretOrKey: process.env.ACCESS_SECRET_KEY,
};

// Refress Token
const opts_refresh = {
  jwtFromRequest: cookieExtractor("refresh"),
  secretOrKey: process.env.REFRESH_SECRET_KEY,
};

const opts_jwt = {
  jwtFromRequest: cookieExtractor("jwt"),
  secretOrKey: process.env.ACCESS_SECRET_KEY,
};

passport.use(
  "access-token-strategy",
  new JwtStrategy(opts_access, async (jwt_payload, done) => {
    try {
      const user = await authService.authenticateAccessJwt(jwt_payload);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

passport.use(
  "jwt-strategy",
  new JwtStrategy(opts_jwt, async (jwt_payload, done) => {
    try {
      const user = await sessionEvents.emitGetUser(jwt_payload?.jti);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

passport.use(
  "check-status",
  new JwtStrategy(opts_refresh, async (jwt_payload, done) => {
    try {
      if (!jwt_payload) return done(null, false);

      const user = await authService.authenticateRefreshJwt(jwt_payload);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

module.exports = passport;
