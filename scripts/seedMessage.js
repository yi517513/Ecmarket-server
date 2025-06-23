require("dotenv").config();
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const { MessageModel } = require("../models");
const { fakeUser } = require("./fakeUser");

mongoose.connect(process.env.MONGODB_URI);

// ObjectId 類型轉換器
const toObjectId = (id) => new mongoose.Types.ObjectId(id);

const FIXED_USER_ID = toObjectId("68287622e13b3a20a98a1e00");

const generateFakeMessage = (from, to) => {
  return {
    from,
    to,
    content: faker.lorem.sentence(),
    isRead: faker.datatype.boolean(),
    createdAt: faker.date.recent({ days: 30 }),
  };
};

const run = async () => {
  try {
    const messages = [];

    for (const user of fakeUser) {
      const userId = toObjectId(user._id);

      for (let i = 0; i < 20; i++) {
        const isFixedSender = Math.random() > 0.5;

        const from = isFixedSender ? FIXED_USER_ID : userId;
        const to = isFixedSender ? userId : FIXED_USER_ID;

        messages.push(generateFakeMessage(from, to));
      }
    }

    await MessageModel.insertMany(messages);

    console.log("✅ 假訊息成功插入！");
    process.exit();
  } catch (error) {
    console.error("❌ 插入失敗", error);
    process.exit(1);
  }
};

run();
