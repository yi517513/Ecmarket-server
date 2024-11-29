const router = require("express").Router();
const {
  uploadProductImage,
  getProductImages,
  deleteProductImages,
} = require("../../controllers/imageController");
const { upload } = require("../../config/s3");

router.post("/", upload.single("image"), uploadProductImage);

router.get("/", getProductImages);

router.delete("/:imageId", deleteProductImages);

module.exports = router;
