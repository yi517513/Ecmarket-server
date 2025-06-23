const jwt = require("jsonwebtoken");

// === 創建 stateless Jwt ===
const generateToken = (user, jti) => {
  const secretKey = process.env.JWT_SECRET;

  return new Promise((resolve, reject) => {
    jwt.sign({ jti, user }, secretKey, { expiresIn: "3s" }, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};

// === 驗證並解密 Token，回傳 Promise ===
const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });
};

// === Token 驗證，不依賴 req/socket/res ===
const identifyToken = async (token) => {
  if (!token) return { status: "none" };

  try {
    const decoded = await verifyToken(token); // 驗證是否有效

    return { status: "valid", jti: decoded?.jti, user: decoded?.user };
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      const decoded = jwt.decode(token); // 嘗試解碼過期 token

      return { status: "expired", jti: decoded?.jti, user: decoded?.user };
    }
    // === 無效，標記 invalid ===
    return { status: "invalid" };
  }
};

module.exports = { generateToken, verifyToken, identifyToken };
