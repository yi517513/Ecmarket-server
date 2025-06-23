const { ImageModel } = require("../../models");

const getImages = async (req, res, next) => {
  try {
    const userId = req.user?._id;

    const foundImages = await ImageModel.find({ ownerId: userId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({ message: null, data: foundImages });
  } catch (error) {
    next(error);
  }
};

module.exports = { getImages };
