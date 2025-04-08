const router = require("express").Router();
const { getSysMessage } = require("../controllers/systemMessageController");

router.get("/", getSysMessage);

module.exports = router;
