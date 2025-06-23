const RedisClient = require("ioredis");

const redis = new RedisClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_KEY,
});

redis.on("connect", () => console.log("Redis 連線成功"));
redis.on("error", (err) => {
  console.error("Redis 連線錯誤:", err);
  process.exit(1); // 連線失敗時強制終止應用程式
});

// 測試連線立即執行（只在應用啟動時執行一次）
redis
  .ping()
  .then(() => console.log("Redis 連線測試成功"))
  .catch((err) => {
    console.error("Redis 無法連線:", err);
    process.exit(1);
  });

module.exports = redis;
