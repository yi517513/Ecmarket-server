const { UserModel } = require("../../models");
const { HttpErrors } = require("../../errors/httpErrors");

const getUserInfo = async (req, res, next) => {
  try {
    const { uid, id, username, email } = req.query || {};
    let user;

    switch (true) {
      case Boolean(uid):
        user = await UserModel.findOne({ uid }).select("_id username uid role");
        break;
      case Boolean(username):
        user = await UserModel.findOne({ username }).select(
          "_id username uid role"
        );
        break;
      case Boolean(email):
        user = await UserModel.findOne({ email }).select(
          "_id username uid role"
        );
        break;
      case Boolean(id):
        user = await UserModel.findById(id).select("_id username uid role");
        break;
      default:
        throw HttpErrors.BadRequest("請提供搜尋條件");
    }

    if (!user) {
      throw HttpErrors.NotFound("找不到使用者");
    }

    res.status(200).json({
      data: {
        userId: user._id,
        uid: user.uid,
        username: user.username,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserInfo };
