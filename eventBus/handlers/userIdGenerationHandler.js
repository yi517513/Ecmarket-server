const { eventEmitter } = require("../eventEmitter");

module.exports = (redisClient) => {
  const USER_ID_KEY = "user:id:counter";

  eventEmitter.on("user.generateId", async (callback) => {
    try {
      console.log("incr");
      const newUserId = await redisClient.incr(USER_ID_KEY);
      callback(null, newUserId);
    } catch (err) {
      console.error("user.generateId 失敗", err);
      callback(err);
    }
  });
};
