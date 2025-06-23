const { UserModel } = require("../../models");
const { HttpErrors } = require("../../errors/httpErrors");

const getUserInfo = async (req, res, next) => {
  try {
    const { uid, username, email } = req.query || {};

    let user;

    if (uid) {
      user = await UserModel.findOne({ uid }).select("_id username uid role");
    } else if (username) {
      user = await UserModel.findOne({ username }).select(
        "_id username uid role"
      );
    } else if (email) {
      user = await UserModel.findOne({ email }).select("_id username uid role");
    } else {
      throw HttpErrors.BadRequest("請提供搜尋條件");
    }

    if (!user) {
      throw HttpErrors.NotFound("找不到使用者");
    }

    res.status(200).json({
      data: { userId: user._id, uid: user.uid, username: user.username },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserInfo };
