const userModal = require("../models/userModel");
const productModel = require("../models/productModel");
const systemMessageModel = require("../models/systemMessageModel");

const socketService = require("../services/socketService");
const userService = require("../services/userService");
const messageService = require("../services/messageService");

const PaymentManager = require("./paymentManager");
const RealTimeManager = require("./realTimeManager");
const ChatManager = require("./chatManager");

const serviceInstances = {
  payment: null,
  realTime: null,
  chat: null,
};

const platformId = "6763f4d87f613773c6f1fca4";

// 獲取PaymentService實例
function getPaymentManager() {
  if (!serviceInstances.payment) {
    serviceInstances.payment = new PaymentManager(
      userModal,
      productModel,
      systemMessageModel,
      platformId
    );
  }
  return serviceInstances.payment;
}

// 獲取RealTimeService實例
function getRealTimeManager() {
  if (!serviceInstances.realTime) {
    serviceInstances.realTime = new RealTimeManager(
      socketService,
      userService,
      messageService
    );
  }
  return serviceInstances.realTime;
}

// 獲取ChatService實例
function getChatManager() {
  if (!serviceInstances.chat) {
    serviceInstances.chat = new ChatManager(socketService, messageService);
  }
  return serviceInstances.chat;
}

module.exports = { getPaymentManager, getRealTimeManager, getChatManager };
