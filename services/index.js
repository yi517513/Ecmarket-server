const { SessionService } = require("./sessionService");
const { OtpService } = require("./otpService");
const { EmailService } = require("./emailService");
const { IdentityService } = require("./identityService");
const { SocketService } = require("./socketService");

const { sendEmail } = require("../utils/adapters");
const redis = require("../config/redis");

module.exports = {
  sessionService: new SessionService(redis),
  identityService: new IdentityService(redis),
  otpService: new OtpService(redis),
  emailService: new EmailService(sendEmail),
  socketService: new SocketService(),
};
