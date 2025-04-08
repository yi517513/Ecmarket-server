const EventEmitter = require("events");
const eventEmitter = new EventEmitter();

// 全域錯誤處理：若有 error 事件，則記錄並做進一步處理
eventEmitter.on("error", (error) => {
  console.error("全域 eventEmitter 錯誤：", error);
  // 這裡可以加上發送通知、記錄到監控系統等邏輯
});

module.exports = { eventEmitter };
