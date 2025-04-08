const { eventEmitter } = require("../eventEmitter");
const { sendCodeToEmail } = require("../../helpers/mailHelper");

module.exports = () => {
  eventEmitter.on("email.sendCode", async ({ email, content }) => {
    try {
      await sendCodeToEmail(email, content);
    } catch (err) {
      console.error("user.sendCode失敗", err);
    }
  });
};
