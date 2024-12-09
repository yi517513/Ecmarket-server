const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const CryptoJS = require("crypto-js");
const { gernerateToken } = require("../utils/tokenHelper");
const { setTokenCookie } = require("../utils/cookieHelper");
const { sendVerificationCode } = require("../utils/mailHelper");

const register = async (req, res) => {
  const { email, password, verificationCode } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.verificationCode !== verificationCode) {
      return res.status(400).send({ message: "驗證碼錯誤或過期", data: null });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.verificationCode = undefined;
    user.username = email;
    user.verified = true;
    await user.save();

    return res.status(201).send({ message: "註冊成功", data: null });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "伺服器發生錯誤", data: null });
  }
};

const login = (req, res) => {
  const user = req.user;

  const accessToken = gernerateToken(user, "access");
  const refreshToken = gernerateToken(user, "refresh");

  try {
    // 設置 Cookies
    setTokenCookie(res, "accessToken", accessToken);
    setTokenCookie(res, "refreshToken", refreshToken);

    return res.status(200).send({
      message: "登入成功",
      data: {
        userId: user.id,
        userName: user.username,
        followedProducts: user.followedProducts,
        isAuthenticated: true,
      },
    });
  } catch (error) {
    return res.status(500).send({ message: "伺服器發生錯誤" });
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    return res.status(200).send({ message: "成功登出", data: null });
  } catch (error) {
    return res.status(500).send({ message: "伺服器發生錯誤" });
  }
};

const sendVerifyCode = async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.verified === true) {
      return res.status(400).send({ message: "此信箱已經被註冊過" });
    }

    const verificationCode = CryptoJS.lib.WordArray.random(3).toString(
      CryptoJS.enc.Hex
    );

    await User.findOneAndUpdate(
      { email },
      { verificationCode },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    sendVerificationCode(email, verificationCode, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).send({ message: "無法發送驗證碼", data: null });
      }
      console.log(verificationCode);
      return res
        .status(200)
        .send({ message: "驗證碼已發送", data: verificationCode });
    });
  } catch (error) {
    return res.status(500).send({ message: `伺服器發生錯誤`, data: null });
  }
};

const refreshAccessToken = (req, res) => {
  const user = req.user;

  const accessToken = gernerateToken(user, "access");

  // 設置 Cookies
  setTokenCookie(res, "accessToken", accessToken);

  return res.status(200).send({ message: null, data: null });
};

const checkAuth = (req, res) => {
  console.log(`checkAuth`);
  const user = req.user;

  return res.status(200).send({
    message: null,
    data: {
      userId: user.id,
      followedProducts: user.followedProducts,
      isAuthenticated: true,
    },
  });
};

module.exports = {
  register,
  login,
  sendVerifyCode,
  refreshAccessToken,
  logout,
  checkAuth,
};
