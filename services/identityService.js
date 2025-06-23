const { HttpErrors } = require("../errors/httpErrors");

class IdentityService {
  constructor(redis) {
    this.redisClient = redis;
    this.COUNTER_HASH_KEY = "register.counter";
  }

  async generateUserUid() {
    try {
      const OFFSET = 100_000; // 從 100000 開始
      const newUserId = await this.redisClient.incr(this.COUNTER_HASH_KEY);
      const uid = newUserId + OFFSET;

      return uid.toString();
    } catch (error) {
      throw new HttpErrors.InternalServer("generateUserUid 發生錯誤:", error);
    }
  }
}

module.exports = { IdentityService };
