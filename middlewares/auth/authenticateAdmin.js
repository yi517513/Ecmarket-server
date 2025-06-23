const { cookieExtractor } = require("../../utils/helpers");
const { identifyToken } = require("../../utils/helpers");
const { createCookie } = require("../../utils/helpers");

const { sessionService } = require("../../services");

/**
 * Admin 專用
 */
const authenticateAdmin = () => async (req, res, next) => {
  // === 提取 JWT token ===
  const token = cookieExtractor("jwt", req);

  // === 驗證 Token ===
  const { status, user, jti } = await identifyToken(token);

  // === 驗證 role ===
  const isAdmin = user?.role === "admin";

  if (!isAdmin) {
    res.clearCookie("jwt");
    console.error(`無權限存取 admin，使用者ID: ${user?._id}`);
    return res.status(401).json({ message: "Unauthorized" });
  }

  // === 驗證 Session 是否還存在 ===
  const isAlive = await sessionService.isSessionAlive(user?._id, jti);

  if (!isAlive) {
    res.clearCookie("jwt");
    return res.status(401).json("Session expired");
  }

  // === 若已過期，重發 cookie ===
  if (status === "expired") {
    const cookie = await createCookie(user, jti);
    res.cookie(cookie.name, cookie.value, cookie.options);
  }

  req.user = { ...user, jti };
  next();
};

module.exports = { authenticateAdmin };
