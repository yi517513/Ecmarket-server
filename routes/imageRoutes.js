const router = require("express").Router();
const { imageController } = require("../controllers");
const { uploadToMemory } = require("../middlewares/multer/uploadToMemory");
const { requireAuth } = require("../middlewares/auth");

router.get("/", requireAuth, imageController.getImages);

router.post(
  "/",
  requireAuth,
  uploadToMemory("image"),
  imageController.uploadImage
);

router.delete("/:imageId", requireAuth, imageController.deleteImage);

module.exports = router;
