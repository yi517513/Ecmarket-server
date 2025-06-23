const { HttpErrors } = require("../../errors/httpErrors");
const { ImageModel } = require("../../models");
const { s3Adapter } = require("../../utils/adapters");
const { v4: uuidv4 } = require("uuid");

const uploadImage = async (req, res, next) => {
  try {
    const userId = req.user?._id;

    const { originalname, buffer, mimetype } = req?.file;
    if (!originalname || !buffer || !mimetype) {
      throw HttpErrors.InternalServer("uploadImage 缺少必要資訊");
    }

    const key = uuidv4() + "-" + originalname;
    await s3Adapter.uploadImage({ buffer, mimetype, key });

    const newImage = await ImageModel.create({
      url: s3Adapter.generateUrl(key),
      key,
      ownerId: userId,
    });

    return res.status(200).json({ message: "上傳成功", data: newImage });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadImage };
