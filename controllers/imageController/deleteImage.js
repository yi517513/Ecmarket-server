const { HttpErrors } = require("../../errors/httpErrors");
const { ImageModel } = require("../../models");

const deleteImage = async (req, res, next) => {
  try {
    const { imageId } = req.params;
    if (!imageId) throw new HttpErrors.BadRequest("缺少圖片 ID");
    const userId = req.user?._id;

    const deletedImage = await ImageModel.deleteOne({
      _id: imageId,
      ownerId: userId,
    });

    if (!deletedImage) throw new HttpErrors.NotFound("找不到指定圖片");

    return res.status(200).json({ message: "成功刪除圖片", data: null });
  } catch (error) {
    next(error);
  }
};

module.exports = { deleteImage };
