const router = require("express").Router();

const { uploadSingleFileToMemory } = require("../middlewares/multer/multer");

const {
  saveImage,
  getImages,
  deleteImage,
} = require("../controllers/imageController");

router.get("/", getImages);

router.post("/", uploadSingleFileToMemory("image"), saveImage);

router.delete("/:imageId", deleteImage);

module.exports = router;
