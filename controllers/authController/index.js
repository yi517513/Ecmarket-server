const { login } = require("./login");
const { logout } = require("./logout");
const { checkMe } = require("./checkMe");
const { register } = require("./register");
const { requestRegisterOtp } = require("./requestRegisterOtp");

module.exports = {
  login,
  logout,
  register,
  requestRegisterOtp,
  checkMe,
};
