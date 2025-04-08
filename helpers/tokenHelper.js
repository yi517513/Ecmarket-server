const jwt = require("jsonwebtoken");

// 生成 token
const generateToken = (jti) => {
  const secretKey = process.env.JWT_SECRET;

  return new Promise((resolve, reject) => {
    jwt.sign({ jti }, secretKey, { expiresIn: "1m" }, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};

// 解密並驗證 token
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

module.exports = { generateToken, verifyToken };
