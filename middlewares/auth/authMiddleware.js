const jwt = require("jsonwebtoken");
const { verifyToken } = require("../../helpers/tokenHelper");
const { cookieExtractor } = require("../../helpers/cookieHelper");
const getUserFromSession = require("./getUserFromSession");
const handleTokenRefresh = require("./handleTokenRefresh");

/**
 * Auth Middleware
 * - 嘗試從 cookie 中解析 JWT
 * - 若有效則附加使用者至 req.user
 * - 若過期則自動刷新並更新 session
 * - 若無效則清除 cookie，不拋錯
 */

const authMiddleware = async (req, res, next) => {
  // ==== 1. 解析 Cookie 並解碼 jti ====
  const token = cookieExtractor("jwt", req);

  if (!token) {
    req.user = null;
    return next(); // 無 token 不拋錯，交由後續判斷
  }

  const decoded = jwt.decode(token); // decode 不會拋錯
  const jti = decoded?.jti;

  // ==== 2. 從 Redis 取得快取使用者資料 ====
  const cacheUser = await getUserFromSession(jti, res);
  if (!cacheUser) {
    req.user = null;
    return next(); // Redis 找不到使用者
  }

  // ==== 3. 驗證 Token 是否有效 ====
  try {
    // ==== 3-1. Token 有效，添加使用者至 req.user ====
    await verifyToken(token);
    req.user = cacheUser; // token 有效
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // ==== 3-2. Token 過期，刷新 Token 並更新 session ====
      await handleTokenRefresh(res, jti, cacheUser);
      req.user = cacheUser;
    } else {
      // ==== 3-3. 其他錯誤（例如無效 token），清除 Cookie ====
      res.clearCookie("jwt");
    }
  } finally {
    // ==== 4. 繼續執行後續 middleware 或 controller ====
    return next();
  }
};

module.exports = authMiddleware;
