const { ChatSummaryModel } = require("../../models");

const getChatSummary = async (req, res, next) => {
  try {
    const userId = req.user?._id;

    const chatSummary = await ChatSummaryModel.find({ owner: userId })
      .populate({ path: "peer", select: "_id uid username" })
      .sort({ lastTime: -1 });

    return res.status(200).json({ data: chatSummary });
  } catch (error) {
    next(error);
  }
};

module.exports = { getChatSummary };
