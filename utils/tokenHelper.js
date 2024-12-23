const jwt = require("jsonwebtoken");

const getSecretKey = (type) => {
  if (type === "access") return process.env.ACCESS_SECRET_KEY;
  if (type === "refresh") return process.env.REFRESH_SECRET_KEY;
  throw new Error("getSecretKey : 無效的token");
};

const gernerateToken = (user, type) => {
  const payload = {
    id: user.id,
    username: user.username,
    ...(type === "refresh" && {
      email: user.email,
      lastLogoutTime: user.lastLogoutTime,
    }),
  };

  const secretKey = getSecretKey(type);
  const expiresIn = type === "access" ? "10m" : "1d";

  return jwt.sign(payload, secretKey, { expiresIn });
};

const decodeToken = (token, type) => {
  try {
    const secretKey = getSecretKey(type);

    // 解密並驗證 token
    const payload = jwt.verify(token, secretKey);

    return payload;
  } catch (err) {
    console.error("Token驗證錯誤 :", err.message);
    return null; // 解密失敗
  }
};

module.exports = { gernerateToken, decodeToken };
