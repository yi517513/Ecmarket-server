const multer = require("multer");

// 使用 memoryStorage 將檔案存放在記憶體中
const storage = multer.memoryStorage();

// 建立 Multer middleware
const upload = multer({ storage });

// 匯出處理單一檔案上傳的中間件
// 可指定檔案欄位名稱，例如 "file"
module.exports = {
  uploadToMemory: (fieldName) => upload.single(fieldName),
};
