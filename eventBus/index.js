const paymentHandler = require("./handlers/paymentHandler");
const orderActivatedHandler = require("./handlers/orderActivatedHandler");
const orderShippedHandler = require("./handlers/orderShippedHandler");
const orderReceivedHandler = require("./handlers/orderReceivedHandler");
const sessionHandler = require("./handlers/sessionHandler");
const registerHandler = require("./handlers/registerHandler");
const userIdGenerationHandler = require("./handlers/userIdGenerationHandler");

module.exports = (io, redisClient) => {
  registerHandler(redisClient);
  sessionHandler(redisClient);
  userIdGenerationHandler(redisClient);
  paymentHandler(io);
  orderActivatedHandler(io);
  orderShippedHandler(io);
  orderReceivedHandler(io);
};
