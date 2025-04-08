const sessionEvents = require("../../eventBus/emitters/sessionEvents");

/**
 * - 嘗試獲取 session
 * - 若有則回傳資料
 * - 若沒有或錯誤則清除 cookie
 *
 * - 此函式用於 *Auth Middleware* 取得快取使用者資料流程
 */

const getUserFromSession = async (jti, res) => {
  try {
    const user = await sessionEvents.emitGetUser(jti);
    if (!user) {
      res.clearCookie("jwt");
      return null;
    }
    return user;
  } catch (error) {
    console.error("emitGetUser 發生錯誤", error);
    res.clearCookie("jwt");
    return null;
  }
};

module.exports = getUserFromSession;
