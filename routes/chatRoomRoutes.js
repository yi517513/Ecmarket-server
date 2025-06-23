const router = require("express").Router();
const { chatRoomController } = require("../controllers");
const { requireAuth } = require("../middlewares/auth");

// 聊天摘要
router.get("/", requireAuth, chatRoomController.getChatSummary);

// 指定對象紀錄
router.get("/messages", requireAuth, chatRoomController.getMessages);

// 發送訊息
router.post("/", requireAuth, chatRoomController.sendMessage);

// 更新訊息
router.post("/markAsRead", requireAuth, chatRoomController.markMessageAsRead);

module.exports = router;
