const paymentRepository = require("../repository/paymentRepository");
const {
  validatePaymentCallback,
  generatePaymentHtml,
} = require("../helpers/ecpayHelper");
const { InternalServerError } = require("../errors/httpErrors");

const { eventEmitter } = require("../eventBus");

class PaymentService {
  constructor(paymentRepository) {
    this.paymentRepo = paymentRepository;
  }

  async generateEcPayPaymentPage({ order = {} }) {
    const { totalAmount, itemTitle, _id, buyer, seller } = order;
    if (!totalAmount || !itemTitle || !_id || !buyer || !seller) {
      throw new InternalServerError("訂單缺少資訊");
    }

    // 創建Ec-Pay支付頁面
    const paymentHtml = generatePaymentHtml({
      totalAmount,
      itemTitle,
      orderId: _id,
      buyer,
      seller,
    });

    return paymentHtml;
  }

  async handlePaymentCallback({ body = {} }) {
    const {
      CheckMacValue,
      CustomField1: orderId,
      CustomField2: payer,
      CustomField3: payee,
      TradeAmt,
    } = body;

    const paymentType = orderId ? "PURCHASE" : "TOPUP";

    const checkValue = validatePaymentCallback(bodyParams);
    if (CheckMacValue !== checkValue) throw new Error("金流Callback發生錯誤");

    const newPayment = await this.paymentRepo.create({
      payer,
      payee,
      paymentType,
      order: orderId,
      amount: TradeAmt,
    });

    eventEmitter.emit("PAYMENT_SUCCESS", { payment: newPayment, paymentType });
  }
}

const paymentService = new PaymentService(paymentRepository);

module.exports = paymentService;
