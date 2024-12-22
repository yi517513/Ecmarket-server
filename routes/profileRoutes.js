const router = require("express").Router();
const {
  getProfile,
  updateProfile,
} = require("../controllers/profileController");

router.get("/", getProfile);

router.patch("/", updateProfile);

module.exports = router;
