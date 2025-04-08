const { eventEmitter } = require("../eventEmitter");

module.exports = (redisClient) => {
  eventEmitter.on(
    "register.setTempEmail",
    async ({ email, verificationCode }) => {
      try {
        await redisClient.set(verificationCode, email, "EX", 3 * 60);
      } catch (err) {
        console.error("session.setUser失敗", err);
      }
    }
  );

  eventEmitter.on("register.getTempEmail", async (key, callback) => {
    try {
      const tempUser = await redisClient.get(key);
      callback(null, tempUser);
    } catch (err) {
      callback(err);
    }
  });
};
