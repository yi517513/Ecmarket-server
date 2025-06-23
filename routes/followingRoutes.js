const router = require("express").Router();
const { followingController } = require("../controllers");
const { requireAuth } = require("../middlewares/auth");

router.get("/", followingController.getFollowings); //首頁

router.post("/:productId", requireAuth, followingController.addFollowing); // 追蹤商品

router.delete("/:productId", requireAuth, followingController.removeFollowing); // 移除追蹤

module.exports = router;
