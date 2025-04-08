const ecpay_payment = require("ecpay_aio_nodejs");
const { MERCHANTID, HASHKEY, HASHIV, RETURN_URL, CLITEN_BACK_URL } =
  process.env;

const ecpayOptions = {
  OperationMode: "Test", // Test or Production
  MercProfile: {
    MerchantID: MERCHANTID,
    HashKey: HASHKEY,
    HashIV: HASHIV,
  },
  IgnorePayment: [], // Disabled payment methods (if any)
  IsProjectContractor: false,
};

// MerchantTradeDate格式
const getMerchantTradeDate = () =>
  new Date().toLocaleString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });

// 用來創建支付頁面的 base_param 及支付 HTML
const generatePaymentHtml = ({
  totalAmount,
  itemTitle,
  orderId,
  buyer,
  seller,
}) => {
  const ecpay = new ecpay_payment(ecpayOptions);
  const TradeNo = "test" + new Date().getTime();

  const base_param = {
    MerchantTradeNo: TradeNo,
    MerchantTradeDate: getMerchantTradeDate(),
    TotalAmount: totalAmount.toString(),
    TradeDesc: itemTitle.toString(),
    ItemName: itemTitle.toString(),
    ReturnURL: RETURN_URL,
    ClientBackURL: CLITEN_BACK_URL,
    CustomField1: orderId.toString(),
    CustomField2: buyer.toString(),
    CustomField3: seller.toString(),
  };

  return ecpay.payment_client.aio_check_out_all(base_param);
};

// 驗證支付回調
const validatePaymentCallback = (bodyParams) => {
  const data = { ...bodyParams };
  delete data.CheckMacValue; // 測試版加入CheckMacValue驗證會錯誤
  const ecpay = new ecpay_payment(ecpayOptions);
  const checkValue = ecpay.payment_client.helper.gen_chk_mac_value(data);
  return checkValue;
};

module.exports = {
  generatePaymentHtml,
  validatePaymentCallback,
};
