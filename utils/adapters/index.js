const {
  paymentHtmlGenerator,
  validatePaymentCallback,
} = require("./ecpayAdapter");
const { sendEmail } = require("./mailAdapter");
const { createS3Adapter } = require("./s3Adapter");

module.exports = {
  paymentHtmlGenerator,
  validatePaymentCallback,
  sendEmail,
  s3Adapter: createS3Adapter(),
};
