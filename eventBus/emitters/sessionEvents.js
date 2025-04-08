const { eventEmitter } = require("../eventEmitter");

const sessionEvents = {
  emitGetUser(jti) {
    return new Promise((resolve, reject) => {
      eventEmitter.emit("session.getUser", jti, (err, user) => {
        if (err) return reject(err);
        resolve(user);
      });
    });
  },
  emitSetUser({ jti, user }) {
    eventEmitter.emit("session.setUser", { jti, user });
  },

  emitDeleteUser(jti) {
    eventEmitter.emit("session.deleteUser", jti);
  },
};

module.exports = sessionEvents;
