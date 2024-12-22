const router = require("express").Router();
const {
  getWishlistItems,
  addItemToWishlist,
  deleteItemFromWishlist,
} = require("../controllers/wishlistController");

// Wishlist
router.get("/", getWishlistItems); // 獲取追蹤商品
router.patch("/", addItemToWishlist); // 加入追蹤商品
router.delete("/:productId", deleteItemFromWishlist); // 刪除追蹤商品

module.exports = router;
