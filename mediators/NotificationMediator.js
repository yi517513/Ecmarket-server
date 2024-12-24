const getRouteMessage = require("../utils/messageUtils");
const realTimeService = require("../managers/realTimeManager");

class NotificationMediator {
  async dispatchSystemMessage({ io, targetId, targetRoute, type, option }) {
    try {
      // 根據目標路由生成訊息
      const content = getRouteMessage(targetRoute, type, option);

      // 儲存訊息到資料庫
      const { socketId, message } = await realTimeService.saveSystemMessage({
        targetId,
        targetRoute,
        content,
      });

      // 發送通知給用戶
      io.to(socketId).emit("realtime:systemMessage", { message, targetRoute });
      return true;
    } catch (error) {
      console.error("dispatchSystemMessage發生錯誤" + error.message);
      return false;
    }
  }

  async notifyUsers({ io, userIds, targetRoute, type, option }) {
    const results = await Promise.all(
      userIds.map((userId) =>
        this.dispatchSystemMessage({
          io,
          targetId: userId,
          targetRoute,
          type,
          option,
        })
      )
    );

    results.forEach((success, index) => {
      if (!success) {
        console.error(`通知用戶失敗 - userId: ${userIds[index]}`);
      }
    });
  }
}

const notificationMediator = new NotificationMediator();
module.exports = notificationMediator;
