const tradeMessageRepository = require("../repository/tradeMessageRepository");
const socketService = require("./socketService");

class TradeRoomService {
  constructor(tradeMessageRepository, socketService) {
    this.tradeMessageRepo = tradeMessageRepository;
    this.socket = socketService;
  }

  async getMessages({ orderId }) {
    return await this.tradeMessageRepo.getMessagesById(orderId);
  }

  async saveMessage({ senderId, orderId, content }) {
    const newMessage = await this.tradeMessageRepo.create({
      senderId,
      orderId,
      content,
    });

    return newMessage;
  }
}

const tradeRoomService = new TradeRoomService(
  tradeMessageRepository,
  socketService
);

module.exports = tradeRoomService;
