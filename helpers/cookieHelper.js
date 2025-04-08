const { generateToken } = require("./tokenHelper");
const { v4: uuidv4 } = require("uuid");

const createCookie = async () => {
  const jti = uuidv4();
  const token = await generateToken(jti);

  const cookie = {
    name: "jwt",
    value: token,
    options: {
      httpOnly: true,
      sameSite: "None", // 如果是跨域，設置為 "None"
      secure: true, // 在生產環境中啟用 secure 標記
      maxAge: 10 * 60 * 1000, // 10m
    },
  };

  return { cookie, jti };
};

// Token 提取器 - Express格式
const cookieExtractor = (cookieName, req) => {
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

module.exports = {
  createCookie,
  cookieExtractor,
  cookieParser,
};
