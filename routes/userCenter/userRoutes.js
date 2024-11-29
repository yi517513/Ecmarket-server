const router = require("express").Router();
const {
  getProfile,
  updateProfile,
} = require("../../controllers/userController");
const validators = require("../../middlewares/validator");

// 獲取使用者訊息
router.get("/", getProfile);

router.patch("/", updateProfile);

module.exports = router;
