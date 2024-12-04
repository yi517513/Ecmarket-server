const setTokenCookie = (res, name, token, options = {}) => {
  const defaultOptions = {
    httpOnly: true,
    sameSite: "None", // 如果是跨域，設置為 "None"
    secure: true, // 在生產環境中啟用 secure 標記
    maxAge: name === "accessToken" ? 10 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000,
  };

  res.cookie(name, token, { ...defaultOptions, ...options });
};

module.exports = { setTokenCookie };
