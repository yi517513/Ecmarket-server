const setTokenCookie = (res, name, token, options = {}) => {
  const defaultOptions = {
    httpOnly: true,
    sameSite: "None", // 如果是跨域，設置為 "None"
    secure: true, // 在生產環境中啟用 secure 標記
    maxAge: name === "accessToken" ? 10 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000,
  };

  res.cookie(name, token, { ...defaultOptions, ...options });
};

// Token 提取器 - Express格式
const cookieExtractor = (cookieName) => (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies[cookieName];
  }
  return token;
};

const cookieParser = (cookieHeader) => {
  const cookies = {};
  if (!cookieParser) return cookies;

  cookieHeader?.split(";").forEach((cookie) => {
    const [key, value] = cookie.split("=").map((v) => v.trim());
    if (key && value) {
      cookies[key] = value;
    }
  });
  return cookies;
};

module.exports = { setTokenCookie, cookieExtractor, cookieParser };
