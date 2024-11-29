const User = require("../models/userModel");
const Image = require("../models/imageModel");
const { s3, DeleteObjectCommand } = require("../config/s3");

const uploadProductImage = async (req, res) => {
  console.log(`using uploadProductImage`);
  try {
    if (!req.file) {
      return res.status(400).send({ message: "沒有上傳圖片" });
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

    const { _id, url } = savedImage;
    console.log(savedImage);
    return res.status(200).send({ message: "上傳成功", data: { _id, url } });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "伺服器發生錯誤" });
  }
};

const getProductImages = async (req, res) => {
  console.log("Inside getProductImages");
  try {
    const userId = req.user.id;
    // 從user中獲取products的ID陣列
    const foundUser = await User.findById(userId).exec();
    const imageIds = foundUser.images;

    // 使用 $in 運算符查找所有符合 ID 陣列的圖片，並只返回 _id 和 url
    const images = await Image.find({ _id: { $in: imageIds } })
      .select("_id url")
      .exec();

    const sortedImages = imageIds
      .map((id) => images.find((image) => image._id.equals(id)))
      .reverse();

    console.log(images);
    return res.status(200).send({ data: sortedImages });
  } catch (error) {
    res.status(500).send({ message: "無法獲取圖片" });
  }
};

const deleteProductImages = async (req, res) => {
  const { imageId } = req.params;
  const userId = req.user.id;

  try {
    // throw new Error("錯誤測試");
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "找不到使用者" });
    }

    // 先刪除圖片資料
    const foundImageAndDelete = await Image.findByIdAndDelete(imageId);
    if (!foundImageAndDelete) {
      return res.status(404).send({ message: "圖片未找到" });
    }

    // 刪除 S3 上的圖片
    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: foundImageAndDelete.key,
    });
    await s3.send(deleteCommand);

    // 從用戶的 images 陣列中刪除該圖片 ID
    await User.findByIdAndUpdate(userId, {
      $pull: { images: imageId },
    });

    res
      .status(200)
      .send({ message: "成功刪除圖片", data: foundImageAndDelete._id });
  } catch (error) {
    console.error("伺服器發生錯誤:", error);
    res.status(500).send({ message: "伺服器發生錯誤" });
  }
};

module.exports = {
  uploadProductImage,
  getProductImages,
  deleteProductImages,
};
