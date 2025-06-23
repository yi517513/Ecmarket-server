const { ImageModel } = require("../../models");

const getCategoies = async (req, res, next) => {
  try {
    const categories = await CategoryModel.find();

    return res.status(200).json({ message: null, data: categories });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategoies };
