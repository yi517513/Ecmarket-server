const { HttpErrors } = require("../errors/httpErrors");

class OtpService {
  constructor(redis) {
    this.redisClient = redis;
    this.OTP_HASH_KEY = "register:otp";
  }

  async getOtp(email) {
    try {
      return await this.redisClient.hget(this.OTP_HASH_KEY, email);
    } catch (error) {
      throw HttpErrors.InternalServer("getOtp 發生錯誤:", error);
    }
  }

  async setOtp({ email, otp, ttl = 300 }) {
    try {
      const key = this.OTP_HASH_KEY;
      await this.redisClient.hset(key, email, otp);
      await this.redisClient.call("HEXPIRE", key, ttl, "FIELDS", "1", email);
    } catch (error) {
      throw HttpErrors.InternalServer("setOtp 發生錯誤:", error);
    }
  }

  async removeOtp(email) {
    try {
      await this.redisClient.hdel(this.OTP_HASH_KEY, email);
    } catch (error) {
      throw HttpErrors.InternalServer("removeOtp 發生錯誤:", error);
    }
  }
}

module.exports = { OtpService };
