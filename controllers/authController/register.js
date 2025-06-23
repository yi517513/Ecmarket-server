const { HttpErrors } = require("../../errors/httpErrors");
const bcrypt = require("bcrypt");
const { UserModel } = require("../../models");
const { identityService, otpService } = require("../../services");

const register = async (req, res, next) => {
  try {
    const { username, email, password, otp } = req.body;
    if (!username || !email || !password || !otp) {
      throw HttpErrors.InternalServer("register 缺少必要資訊");
    }

    // === 根據 OTP 取得暫存的信箱資訊 ===
    const cachedOtp = await otpService.getOtp(email);
    if (!cachedOtp || otp !== cachedOtp) {
      throw HttpErrors.Unprocessable("驗證碼錯誤或已過期");
    }

    // === 密碼加密與產生使用者 UID ===
    const [hashedPassword, uid] = await Promise.all([
      bcrypt.hash(password, 10),
      identityService.generateUserUid(),
    ]);

    // === 建立新使用者帳號 ===
    await UserModel.create({ uid, username, email, hashedPassword });

    await otpService.removeOtp(email);

    return res.status(201).json({ message: "註冊成功", data: null });
  } catch (error) {
    next(error);
  }
};

module.exports = { register };
