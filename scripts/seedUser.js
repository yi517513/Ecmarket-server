require("dotenv").config();
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const { UserModel } = require("../models");
const { fakeUser } = require("./fakeUser");

mongoose.connect(process.env.MONGODB_URI);

const generateFakeUser = (_id, uid) => {
  return {
    _id,
    uid,
    username: faker.internet.userName(),
    email: faker.internet.email(),
    hashedPassword: faker.internet.password({ length: 10 }),
    // following: [],
    role: "user",
    logoutAt: null,
    loginAt: new Date(),
  };
};

const run = async () => {
  try {
    const fakeUsers = fakeUser.map(({ _id, uid }) =>
      generateFakeUser(new mongoose.Types.ObjectId(_id), uid)
    );
    await UserModel.insertMany(fakeUsers);

    console.log("✅ 假使用者成功插入！");

    process.exit();
  } catch (error) {
    console.error("❌ 插入失敗", error);
    process.exit(1);
  }
};

run();
