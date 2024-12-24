const getRouteMessage = (targetRoute, type, option = {}) => {
  const targetMessages = {
    success: {
      "/user-center/buyer/pre-transaction":
        "已完成付款，請選擇「開啟交易」'或「取消交易」，取消後款項將會退至您的錢包",
      "/user-center/user/wallet": "已完成儲值，系通將更新您的錢包",
    },
    error: {
      "/user-center/buyer/pre-transaction": `${option.itemTitle} 該商品已更新價格或刪除，款項將退回至您的錢包`,
    },
  };

  // 驗證目標訊息是否存在
  if (!targetMessages[type] || !targetMessages[type][targetRoute]) {
    throw new Error("未知路由或類型");
  }

  return targetMessages[type][targetRoute];
};

module.exports = getRouteMessage;
