const { HttpErrors } = require("../../errors/httpErrors");
const { UserModel } = require("../../models");
const { sessionService } = require("../../services");

const logout = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      throw HttpErrors.InternalServer("logout 缺少使用者資料");
    }

    const { _id: userId, jti } = req.user || {};

    await Promise.all([
      UserModel.updateOne({ _id: userId }, { $set: { logoutAt: new Date() } }),
      sessionService.removeUserSession(userId, jti),
    ]);

    res.clearCookie("jwt");

    return res.status(200).json({ message: "成功登出", data: null });
  } catch (error) {
    next(error);
  }
};

module.exports = { logout };
