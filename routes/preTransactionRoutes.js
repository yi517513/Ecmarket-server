const router = require("express").Router();
const {
  getPreTransactions,
  createPreTransaction,
  cancelPreTransaction,
} = require("../controllers/preTransactionController");

// Pre-Transaction - 平台收到付款，但尚未開啟交易階段
router.get("/", getPreTransactions); // 獲取所有待準備的交易
router.post("/create", createPreTransaction); // 創建交易準備
router.delete("/cancel", cancelPreTransaction); // 取消交易準備

module.exports = router;
