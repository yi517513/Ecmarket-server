class SessionService {
  constructor(redis) {
    this.redisClient = redis;
    this.SESSION_HASH_KEY = "session:user:";
  }

  async addUserSession({ userId, jti, device, loginAt, ttl = 3600 * 3 }) {
    const key = `${this.SESSION_HASH_KEY}${userId}`;
    await this.redisClient.hset(key, jti, JSON.stringify({ device, loginAt }));
    await this.redisClient.call("HEXPIRE", key, ttl, "FIELDS", "1", jti);
  }

  async removeUserSession(userId, jti) {
    const key = `${this.SESSION_HASH_KEY}${userId}`;
    await this.redisClient.hdel(key, jti);
  }

  async isSessionAlive(userId, jti) {
    const key = `${this.SESSION_HASH_KEY}${userId}`;
    return await this.redisClient.hexists(key, jti);
  }

  async getUserSessions(userId) {
    const key = `${this.SESSION_HASH_KEY}${userId}`;
    const rawData = await this.redisClient.hgetall(key);

    const sessions = Object.entries(rawData)
      .map(([jti, value]) => {
        const { device, loginAt } = JSON.parse(value);

        return { jti, deviceLabel: device, loginAt };
      })
      .sort((a, b) => new Date(b.loginAt) - new Date(a.loginAt)); // 根據 loginAt 遞減排序;

    return sessions;
  }
}

module.exports = { SessionService };
