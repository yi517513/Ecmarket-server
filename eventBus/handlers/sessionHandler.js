const { eventEmitter } = require("../eventEmitter");

module.exports = (redisClient) => {
  eventEmitter.on("session.getUser", async (jti, callback) => {
    const userJson = await redisClient.get(jti);
    const user = userJson ? JSON.parse(userJson) : null;
    callback(null, user);
  });

  eventEmitter.on("session.setUser", async ({ jti, user }) => {
    try {
      await redisClient.set(jti, JSON.stringify(user), "EX", 24 * 60 * 60);
    } catch (err) {
      console.error("session.setUser失敗", err);
    }
  });

  eventEmitter.on("session.deleteUser", async (jti) => {
    try {
      console.log("session.deleteUser", jti);
      await redisClient.del(jti);
    } catch (err) {
      console.error("session.deleteUser失敗", err);
    }
  });
};
