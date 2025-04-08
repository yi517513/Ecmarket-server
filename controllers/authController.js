const authService = require("../services/authService");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, cookie } = await authService.login({ email, password });

    // 設置 Cookies
    const { name, value, options } = cookie;
    res.cookie(name, value, options);

    return res.status(200).send({ message: "登入成功", data: user });
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const { username, email, password, verificationCode } = req.body;

    await authService.register({ username, email, password, verificationCode });

    return res.status(201).send({ message: "註冊成功", data: null });
  } catch (error) {
    next(error);
  }
};

const sendVerificationCode = async (req, res, next) => {
  try {
    const { email } = req.body;
    await authService.sendCode({ email });

    return res.status(200).send({ message: "驗證碼已發送", data: null });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  res.clearCookie("jwt");

  try {
    const userId = req.user?.userId;
    await authService.logout({ currentUserId: userId });

    return res.status(200).send({ message: "成功登出", data: null });
  } catch (error) {
    next(error);
  }
};

const checkStatus = (req, res, next) => {
  try {
    const user = req.user;

    if (!user) return res.status(200).send({ message: null, data: null });

    return res
      .status(200)
      .send({ message: null, data: { isAuthenticated: true, ...user } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  sendVerificationCode,
  logout,
  checkStatus,
};
