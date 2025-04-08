const imageService = require("../services/imageService");

const saveImage = async (req, res, next) => {
  try {
    await imageService.saveImage({
      file: req.file,
      currentUser: req.user,
    });

    return res.status(200).send({ message: "上傳成功", data: null });
  } catch (error) {
    next(error);
  }
};

const getImages = async (req, res, next) => {
  try {
    const currentUserId = req.user?.id;
    const foundImages = await imageService.getImages({ currentUserId });

    return res.status(200).send({ message: null, data: foundImages });
  } catch (error) {
    next(error);
  }
};

const deleteImage = async (req, res, next) => {
  try {
    const { imageId } = req.params;
    const currentUserId = req.user?.id;

    await imageService.deleteImage({ imageId, currentUserId });

    return res.status(200).send({ message: "成功刪除圖片", data: null });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  saveImage,
  getImages,
  deleteImage,
};
