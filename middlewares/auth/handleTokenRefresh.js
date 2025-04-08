const sessionEvents = require("../../eventBus/emitters/sessionEvents");
const { createCookie } = require("../../helpers/cookieHelper");

/**
 * - 更新 session 中的 jti
 * - 回應新的 cookie 給客戶端
 *
 * - 此函式用於 *Auth Middleware* 處理 Token 過期流程
 */

const handleTokenRefresh = async (res, oldJti, cacheUser) => {
  try {
    const { cookie, jti: newJti } = await createCookie();
    sessionEvents.emitSetUser({ jti: newJti, user: cacheUser });
    sessionEvents.emitDeleteUser(oldJti);

    res.cookie(cookie.name, cookie.value, cookie.options);
  } catch (error) {
    console.error("refreshSession 發生錯誤", error);
  }
};

module.exports = handleTokenRefresh;
