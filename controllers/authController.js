const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const CryptoJS = require("crypto-js");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const gernerateToken = (user) => {
  const payload = {
    id: user.id,
  };
  return jwt.sign(payload, process.env.ACCESS_SECRET_KEY, { expiresIn: "5m" });
};

const gernerateRefreshToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    username: user.username,
  };
  return jwt.sign(payload, process.env.REFRESH_SECRET_KEY, {
    expiresIn: "1d",
  });
};

const register = async (req, res) => {
  console.log(`using register route`);
  const { email, password, verificationCode } = req.body;
  try {
    const user = await User.findOne({ email }).exec();
    if (!user || user.verificationCode !== verificationCode) {
      return res.status(400).send({ message: "驗證碼錯誤或過期" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.verificationCode = undefined;
    user.username = email;
    user.veriftyed = true;
    await user.save();

    return res.status(201).send({ message: "註冊成功", data: null });
  } catch (error) {
    return res.status(500).send("伺服器發生錯誤 " + error.message);
  }
};

const login = (req, res) => {
  console.log(`using login router`);
  const user = req.user;
  const accessToken = gernerateToken(user);
  const refreshToken = gernerateRefreshToken(user);

  try {
    // throw new Error("錯誤測試");

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // 在生產環境中啟用 secure 標記
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // 在生產環境中啟用 secure 標記
    });

    return res.status(200).send({ message: "登入成功", data: user.id });
  } catch (error) {
    return res.status(500).send({ message: "伺服器發生錯誤" });
  }
};

const logout = (req, res) => {
  try {
    // throw new Error("錯誤測試");

    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    return res.status(200).send({ message: "成功登出", data: null });
  } catch (error) {
    return res.status(500).send({ message: "伺服器發生錯誤" });
  }
};

const sendVerifyCode = async (req, res) => {
  console.log(`using sendVerifyCode route`);
  const { email } = req.body;
  try {
    // throw new Error("錯誤測試");

    // await new Promise((resolve) => setTimeout(resolve, 2000));

    const existingUser = await User.findOne({ email }).exec();
    if (existingUser && existingUser.veriftyed === true) {
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

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Verification Code",
      text: `Your verification code is ${verificationCode}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).send({ message: "無法發送驗證碼" });
      } else {
        console.log(verificationCode);
        return res
          .status(200)
          .send({ message: "驗證碼已發送", data: verificationCode });
      }
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: `伺服器發生錯誤 + ${error.message}` });
  }
};

const refreshAccessToken = (req, res) => {
  const user = req.user;
  const newAccessToken = gernerateToken(user);

  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  return res.status(200).send({ message: null, data: null });
};

const checkAuth = (req, res) => {
  console.log(`using checkAuth router`);
  const userId = req.user.id;

  return res.status(200).send({ message: null, data: userId });
};

module.exports = {
  register,
  login,
  sendVerifyCode,
  refreshAccessToken,
  logout,
  checkAuth,
};
