require("dotenv").config();
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const { ChatSummaryModel } = require("../models");
const { fakeUser } = require("./fakeUser");

mongoose.connect(process.env.MONGODB_URI);

// 固定使用者
const FIXED_USER_ID = new mongoose.Types.ObjectId("68287622e13b3a20a98a1e00");

// 過濾掉自己
const contactIds = fakeUser
  .map((u) => new mongoose.Types.ObjectId(u._id))
  .filter((id) => !id.equals(FIXED_USER_ID));

// 生成一筆 ChatSummary 資料（owner 為自己，peer 為對方）
const generateChatSummary = (peerId) => ({
  owner: FIXED_USER_ID,
  peer: peerId,
  lastMessage: faker.lorem.sentence({ min: 3, max: 10 }),
  lastTime: faker.date.recent({ days: 3 }),
  unreadCount: faker.number.int({ min: 0, max: 12 }),
});

const run = async () => {
  try {
    const fakeSummaries = contactIds.map(generateChatSummary);

    await ChatSummaryModel.insertMany(fakeSummaries);

    console.log("✅ 假聊天摘要成功插入！");
    process.exit();
  } catch (error) {
    console.error("❌ 插入失敗", error);
    process.exit(1);
  }
};

run();
