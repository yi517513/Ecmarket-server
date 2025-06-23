const { sessionService } = require("../../services");

const getUserSession = async (req, res, next) => {
  try {
    const { _id: userId } = req.user || {};

    const sessions = await sessionService.getUserSessions(userId);
    return res.status(200).json({ message: null, data: sessions });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserSession };
