const { eventEmitter } = require("../eventEmitter");

const userIdEvents = {
  emitGenerateUserId() {
    console.log("emit:incr");
    return new Promise((resolve, reject) => {
      eventEmitter.emit("user.generateId", (err, newUserId) => {
        if (err) return reject(err);
        resolve(newUserId);
      });
    });
  },
};

module.exports = userIdEvents;
