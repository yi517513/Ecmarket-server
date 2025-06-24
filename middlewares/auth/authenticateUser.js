const { cookieExtractor } = require("../../utils/helpers");
const { identifyToken } = require("../../utils/helpers");
const { createCookie } = require("../../utils/helpers");

const { sessionService } = require("../../services");

/**
 * "optional": 驗證失敗的話照樣進入下一層 (辨識用途)
 * "jwt": 驗證失敗就 401
 */
const authenticateUser =
  ({ mode }) =>
  async (req, res, next) => {
    // === 提取 JWT token ===
    const token = cookieExtractor("jwt", req);

    // === 驗證 Token ===
    const { status, user, jti } = await identifyToken(token);

    // ==== 無效或沒有，清除 cookie ====
    const isInvalid = status === "none" || status === "invalid";
    if (isInvalid) {
      res.clearCookie("jwt");

      if (mode === "optional") {
        res.clearCookie("jwt");
        req.user = null;
        return next();
      }

      if (mode === "jwt") {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // === catch 未支援的模式 ===
      return res.status(400).json(`Unsupported auth mode: ${mode}`);
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

      const { name, value, options } = cookie;

      // console.log("-------------------------");
      // console.log("name:");
      // console.log(name);
      // console.log("-------------------------");
      // console.log("value:");
      // console.log(value);
      // console.log("-------------------------");
      // console.log("options:");
      // console.log(options);
      res.cookie(name, value, options);
    }

    req.user = { ...user, jti };
    next();
  };

module.exports = { authenticateUser };
