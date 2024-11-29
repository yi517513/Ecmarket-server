const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

// LocalStrategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      console.log("in localStrategy");
      try {
        const foundUser = await User.findOne({ email }).exec();
        if (!foundUser) {
          return done(null, false, { message: "信箱或密碼錯誤" });
        }
        const isMatch = await bcrypt.compare(password, foundUser.password);
        if (!isMatch) return done(null, false, { message: "信箱或密碼錯誤" });
        return done(null, foundUser);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Token 提取器
const cookieExtractor = (cookieName) => (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies[cookieName];
  }
  // console.log(`cookieName: ${cookieName},token: ${token}`);
  return token;
};

// Access Token
const opts_access = {
  // 從req.header中獲取token的方式改為從cookie
  jwtFromRequest: cookieExtractor("accessToken"),
  secretOrKey: process.env.ACCESS_SECRET_KEY,
};

passport.use(
  "access-token-strategy",
  new JwtStrategy(opts_access, async (jwt_payload, done) => {
    try {
      const foundUser = await User.findById(jwt_payload.id).exec();
      if (foundUser) {
        return done(null, foundUser);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

// Refress Token
const opts_refresh = {
  jwtFromRequest: cookieExtractor("refreshToken"),
  secretOrKey: process.env.REFRESH_SECRET_KEY,
};

passport.use(
  "refresh-token-strategy",
  new JwtStrategy(opts_refresh, async (jwt_payload, done) => {
    // console.log("refresh-token-strategy");
    try {
      const foundUser = await User.findById(jwt_payload.id).exec();
      if (foundUser) {
        return done(null, foundUser);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

const passport_Refresh = (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).send();
  }

  passport.authenticate(
    "refresh-token-strategy",
    { session: false },
    (err, user, info) => {
      if (err) {
        console.log("server error", err);
        return res.status(500).send("Server error");
      }
      if (!user) {
        try {
          res.clearCookie("refreshToken");
          res.clearCookie("accessToken");
          return res.status(401).send("Token失效，已登出");
        } catch (error) {
          return res.status(500).send("伺服器發生錯誤");
        }
      }
      req.user = user;
      next();
    }
  )(req, res, next);
};

const passport_Access = passport.authenticate("access-token-strategy", {
  session: false,
});
const passportLocal = passport.authenticate("local", { session: false });

module.exports = { passport_Access, passport_Refresh, passportLocal };
