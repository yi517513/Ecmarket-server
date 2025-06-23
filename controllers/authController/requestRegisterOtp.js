const { HttpErrors } = require("../../errors/httpErrors");
const { otpGenerator } = require("../../utils/helpers");
const { UserModel } = require("../../models");
const { otpService, emailService } = require("../../services");

const requestRegisterOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) throw new HttpErrors.BadRequest("缺少信箱");

    // === 檢查信箱是否已被註冊 ===
    const existingUser = await UserModel.exists({ email });
    if (existingUser) throw new HttpErrors.Conflict("此信箱已經被註冊過");

    // === 產生 otp ===
    const otp = otpGenerator();

    // === 暫存 email 與 otp ===
    await otpService.setOtp({ email, otp });

    // === 發送 otp 至信箱 ===
    await emailService.sendToEmail({ email, content: otp });

    return res.status(200).json({ message: "驗證碼已發送", data: null });
  } catch (error) {
    next(error);
  }
};

module.exports = { requestRegisterOtp };
