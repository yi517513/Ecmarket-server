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
const ecCreatePayment = ({
  TradeNo,
  TotalAmount,
  TradeDesc,
  ItemName,
  CustomField1,
  CustomField2,
  CustomField3,
}) => {
  const ecpay = new ecpay_payment(ecpayOptions);
  const base_param = {
    MerchantTradeNo: TradeNo,
    MerchantTradeDate: getMerchantTradeDate(),
    TotalAmount: TotalAmount.toString(),
    TradeDesc,
    ItemName,
    ReturnURL: RETURN_URL,
    ClientBackURL: CLITEN_BACK_URL,
    CustomField1,
    CustomField2,
    CustomField3,
  };

  const paymentHtml = ecpay.payment_client.aio_check_out_all(base_param);
  return paymentHtml;
};

// 驗證支付回調
const validatePaymentCallback = (data) => {
  const ecpay = new ecpay_payment(ecpayOptions);
  const checkValue = ecpay.payment_client.helper.gen_chk_mac_value(data);
  return checkValue;
};

module.exports = {
  ecCreatePayment,
  validatePaymentCallback,
};
