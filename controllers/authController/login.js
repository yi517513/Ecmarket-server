const bcrypt = require("bcrypt");
const { HttpErrors } = require("../../errors/httpErrors");
const { jtiGenerator, createCookie } = require("../../utils/helpers");
const { UserModel } = require("../../models");
const { sessionService } = require("../../services");

const login = async (req, res, next) => {
  try {
    const { email, password, device } = req.body;
    if (!email || !password) throw HttpErrors.BadRequest("缺少信箱或密碼");

    const foundUser = await UserModel.findOne({ email });
    if (!foundUser) throw HttpErrors.BadRequest("信箱或密碼錯誤");

    const isMatch = await bcrypt.compare(password, foundUser.hashedPassword);
    if (!isMatch) throw HttpErrors.BadRequest("信箱或密碼錯誤");

    foundUser.loginAt = new Date();
    const updatedUser = await foundUser.save();

    const jti = jtiGenerator();
    const cookie = await createCookie(updatedUser, jti);

    // === 儲存至 Redis 當作 Session ===
    const { id: userId, loginAt } = updatedUser || {};
    await sessionService.addUserSession({ userId, jti, device, loginAt });

    // 設置 Cookies
    const { name, value, options } = cookie;
    res.cookie(name, value, options);

    const isAdmin = updatedUser?.role === "admin";

    res.status(200).json({
      message: "登入成功",
      data: { user: updatedUser, isAdmin, isAuth: true },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { login };
