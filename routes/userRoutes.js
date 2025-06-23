const router = require("express").Router();
const { userController } = require("../controllers");

router.get("/", userController.getUserInfo);

module.exports = router;
