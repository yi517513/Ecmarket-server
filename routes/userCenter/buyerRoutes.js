const express = require("express");
const router = express.Router();
const {
  getBuyerCartItems,
  addToBuyerCart,
  deleteBuyerCartItem,
  getBuyerAwaitingShipment,
  getBuyerPurchaseHistory,
} = require("../../controllers/buyerController");

// 獲取追蹤商品
router.get("/cart", getBuyerCartItems);
// 加入追蹤商品
router.patch("/cart", addToBuyerCart);
// 刪除追蹤商品
router.delete("/cart/:productId", deleteBuyerCartItem);

// 移交中訂單（已付款，待發貨）
router.get("/orders/awaiting-shipment", getBuyerAwaitingShipment);

// 購買歷史（已完成）
router.get("/orders/history", getBuyerPurchaseHistory);

module.exports = router;
