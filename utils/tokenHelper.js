const jwt = require("jsonwebtoken");

const gernerateToken = (user, type) => {
  const payload = {
    id: user.id,
    ...(type === "refresh" && { email: user.email, username: user.username }),
  };

  const secretKey =
    type === "access"
      ? process.env.ACCESS_SECRET_KEY
      : process.env.REFRESH_SECRET_KEY;

  const expiresIn = type === "access" ? "10m" : "1d";

  return jwt.sign(payload, secretKey, { expiresIn });
};

module.exports = { gernerateToken };
