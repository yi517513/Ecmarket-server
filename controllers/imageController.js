const User = require("../models/userModel");
const Image = require("../models/imageModel");
const { s3, DeleteObjectCommand } = require("../config/s3");

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: "沒有上傳圖片", data: null });
    }

    const imageUrl = req.file.location;
    const imageKey = req.file.key;
    const userId = req.user.id;

    // 創建新的圖片記錄
    const newImage = new Image({ url: imageUrl, key: imageKey, userId });
    const savedImage = await newImage.save();

    // 更新用戶的 images 欄位，將新圖片的 ID 添加進去
    await User.findByIdAndUpdate(userId, {
      $push: { images: savedImage._id },
    });

    const { url } = savedImage;
    console.log(savedImage);
    return res.status(200).send({ message: "上傳成功", data: url });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "伺服器發生錯誤" });
  }
};

const getUserImages = async (req, res) => {
  try {
    const userId = req.user.id;

    const foundUser = await User.findById(userId).populate(
      "images",
      "_id url createdAt"
    );

    const imageIds = foundUser.images;

    const sortedImages = imageIds
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((image) => image.url);

    return res.status(200).send({ data: sortedImages });
  } catch (error) {
    res.status(500).send({ message: "無法獲取圖片" });
  }
};

const deleteImages = async (req, res) => {
  console.log(`deleteImages route`);
  const imageUrl = decodeURIComponent(req.params.imageUrl);
  console.log(imageUrl);
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "找不到使用者" });
    }

    const foundImage = await Image.findOne({ url: imageUrl });
    if (!foundImage) {
      return res.status(404).send({ message: "圖片未找到" });
    }

    const deleteImagePromise = Image.deleteOne({ url: imageUrl }).exec();
    const deleteS3ImagePromise = s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: foundImage.key,
      })
    );
    const updateUserImage = User.updateOne(
      { _id: userId },
      { $pull: { images: foundImage._id } }
    ).exec();

    await Promise.all([
      deleteImagePromise,
      deleteS3ImagePromise,
      updateUserImage,
    ]);

    return res
      .status(200)
      .send({ message: "成功刪除圖片", data: foundImage._id });
  } catch (error) {
    console.error("伺服器發生錯誤:", error);
    return res.status(500).send({ message: "伺服器發生錯誤" });
  }
};

module.exports = {
  uploadImage,
  getUserImages,
  deleteImages,
};
