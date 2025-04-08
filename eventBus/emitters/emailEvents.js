const { eventEmitter } = require("../eventEmitter");

const emailEvents = {
  emitSendCode({ email, content }) {
    eventEmitter.emit("email.sendCode", { email, content });
  },
};

module.exports = emailEvents;
