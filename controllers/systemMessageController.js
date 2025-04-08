const systemMessageService = require("../services/systemMessageService");

const getSysMessage = async (req, res, next) => {
  try {
    const currentUserId = req.user?.id;

    const messages = await systemMessageService.getSystemMessages({
      currentUserId,
    });

    console.log(messages);

    return res.status(200).send({ message: null, data: messages });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSysMessage };
