const CryptoJS = require("crypto-js");

const generateCode = (length = 3) => {
  return CryptoJS.lib.WordArray.random(length).toString(CryptoJS.enc.Hex);
};

const verifyPassword = (rawPassword, hashedPassword) => {
  if (!hashedPassword) {
    throw new UnauthorizedError("信箱或密碼錯誤");
  }
  const isMatch = bcrypt.compareSync(rawPassword, hashedPassword);
  if (!isMatch) {
    throw new UnauthorizedError("信箱或密碼錯誤");
  }
};

module.exports = { generateCode, verifyPassword };
