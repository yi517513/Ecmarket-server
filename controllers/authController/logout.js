const { HttpErrors } = require("../../errors/httpErrors");
const { UserModel } = require("../../models");
const { sessionService } = require("../../services");

const logout = async (req, res, next) => {
  try {
    const { _id: userId, jti } = req.user || {};
    if (!userId) throw new HttpErrors.BadRequest("缺少使用者 ID");

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
