const express = require("express");
const router = express.Router();
const {
  getSellerPendingShipment,
  getSellerSalesHistory,
  sellerConfirmShipment,
  getSellerProducts,
} = require("../../controllers/sellerController");
const { deleteProduct } = require("../../controllers/productController");

// 獲取賣家所有商品
router.get("/products", getSellerProducts);
// 刪除賣家商品
router.delete("/products/:productId", deleteProduct);

// 待發貨的訂單
router.get("/orders/pending", getSellerPendingShipment);

// 出售歷史（已完成）
router.get("/orders/history", getSellerSalesHistory);

// 確認出貨（更新交易狀態）
router.patch("/orders/:transactionId/confirm", sellerConfirmShipment);

module.exports = router;
