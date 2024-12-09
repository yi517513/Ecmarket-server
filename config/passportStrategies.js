const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const { cookieExtractor } = require("../utils/cookieHelper");

const opts_local = {
  usernameField: "email",
  passwordField: "password",
};

// Access Token
const opts_access = {
  // 從req.header中獲取token的方式改為從cookie
  jwtFromRequest: cookieExtractor("accessToken"),
  secretOrKey: process.env.ACCESS_SECRET_KEY,
};

// Refress Token
const opts_refresh = {
  jwtFromRequest: cookieExtractor("refreshToken"),
  secretOrKey: process.env.REFRESH_SECRET_KEY,
};

// LocalStrategy
passport.use(
  "local-strategy",
  new LocalStrategy(opts_local, async (email, password, done) => {
    try {
      const foundUser = await User.findOne({ email });
      if (!foundUser) {
        return done(null, false);
      }
      const isMatch = await bcrypt.compare(password, foundUser.password);
      if (!isMatch) return done(null, false);
      return done(null, foundUser);
    } catch (error) {
      return done(error, false);
    }
  })
);

passport.use(
  "access-token-strategy",
  new JwtStrategy(opts_access, async (jwt_payload, done) => {
    try {
      const foundUser = await User.findById(jwt_payload.id);
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

passport.use(
  "refresh-token-strategy",
  new JwtStrategy(opts_refresh, async (jwt_payload, done) => {
    try {
      const foundUser = await User.findById(jwt_payload.id);
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

module.exports = passport;
