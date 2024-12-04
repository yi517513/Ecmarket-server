const router = require("express").Router();
const {
  uploadImage,
  getUserImages,
  deleteImages,
} = require("../../controllers/imageController");
const { upload } = require("../../config/s3");

router.post("/", upload.single("image"), uploadImage);

router.get("/", getUserImages);

router.delete("/:imageUrl", deleteImages);

module.exports = router;
