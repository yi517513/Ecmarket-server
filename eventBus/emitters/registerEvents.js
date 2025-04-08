const { eventEmitter } = require("../eventEmitter");

const registerEvents = {
  emitSetTempEmail({ email, verificationCode }) {
    eventEmitter.emit("register.setTempEmail", { email, verificationCode });
  },
  emitGetTempEmail(key) {
    return new Promise((resolve, reject) => {
      eventEmitter.emit("register.getTempEmail", key, (err, tempUser) => {
        if (err) return reject(err);
        resolve(tempUser);
      });
    });
  },
};

module.exports = registerEvents;
