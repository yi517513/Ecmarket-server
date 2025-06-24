# ECmarket 後端專案（Backend）

此為 C2C 電商平台「ECmarket」的後端伺服器，使用 Node.js + Express 開發，提供商品管理、訂單處理、用戶驗證、聊天室、圖片上傳、付款模擬等完整 API，搭配 MongoDB 作為資料庫，並整合 AWS S3、Socket.IO、ECPay 等第三方服務。

---

## 使用技術與套件

- **Node.js 20**
- **Express**：建立 RESTful API
- **Mongoose**：MongoDB ODM
- **JWT + Passport.js**：用戶登入驗證
- **Joi**：參數驗證
- **Bcrypt**：密碼加密
- **Cookie-parser**：管理登入狀態
- **Dotenv**：管理環境變數
- **Nodemailer**：註冊信箱驗證碼寄送
- **EJS**：產生付款頁面（配合綠界 ECPay）
- **ECPay SDK**：綠界金流模擬付款流程
- **Socket.IO**：即時聊天室功能
- **ioredis**：用於登入 session 管理、多裝置登入追蹤、UID 編號自動遞增等功能
- **AWS SDK + multer-s3**：圖片上傳至 AWS S3
- **UUID / Crypto-JS**：生成唯一 ID 與資料加密
- **@faker-js/faker**：開發階段假資料建立

---

## API 功能模組

| 模組     | 說明                                       |
| -------- | ------------------------------------------ |
| Auth     | 使用者登入、註冊、JWT 驗證、OTP 驗證碼寄送 |
| Products | 商品 CRUD（賣家商品管理 / 公開商品）       |
| Orders   | 建立訂單、模擬付款、交易狀態管理           |
| Chat     | Socket.IO 雙向即時通訊功能                 |
| Images   | 上傳圖片、刪除圖片（儲存於 S3）            |

---

## Session 驗證與登入裝置管理

本專案採用 **JWT + Redis 混合式認證機制**，同時支援多裝置登入狀態管理與安全驗證。

### 架構說明

- **JWT Token（含 jti）**  
  登入後會發送包含 `jti`（唯一識別碼）的 JWT，代表該次登入的 session。

- **Redis 作為 session 儲存區**  
  每個使用者的所有登入紀錄皆以 `HSET` 儲存在 Redis 中：

  ```js
  const key = `session:user:${userId}`;
  await redis.hset(key, jti, JSON.stringify({ device, loginAt }));
  ```

- **每次請求驗證 session 是否仍有效**
  ```js
  await redis.hexists(key, jti);
  ```

### 功能特色

- 使用者可從前端查詢目前登入中的裝置（對應 Redis 中的 key）
- 登出時會刪除該筆 jti，可實作單點登出或全部登出
- 註冊時透過 Redis `INCR` 指令產生連續 `uid`
- 架構可擴充為「踢出其他裝置」等高階功能

---

### Cookie 安全性補充

登入成功後，JWT 會儲存在 `httpOnly` cookie 中，避免被前端 JavaScript 存取，有效降低 XSS 攻擊風險。

---
