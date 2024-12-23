const generateTargetRouteMsg = (targetRoute) => {
  const targetMessages = {
    "/user-center/buyer/transactions/open":
      "已完成付款，請選擇選擇開啟交易或取消交易，取消後錢將會退回錢包",
    "/user-center/user/wallet": "已完成儲值，系通將更新用戶錢包",
  };

  return targetMessages[targetRoute] || "未知路由，請檢查設定";
};

module.exports = generateTargetRouteMsg;
