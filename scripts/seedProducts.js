require("dotenv").config();

const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const { ProductModel } = require("../models");
const { fakeUser } = require("./fakeUser");

// 資料庫連線
mongoose.connect(process.env.MONGODB_URI);

const categories = ["mapleStory", "LoL"];
const productTypes = ["account", "item", "money"];
const now = new Date();

const generateFakeImageSnapshot = (ownerId) => {
  const _id = faker.string.uuid();
  const url = faker.image.url();
  const timestamp = faker.date.past();
  const createdAt = faker.date.between({ from: timestamp, to: now });

  return {
    _id,
    url,
    ownerId: ownerId.toString(), // 快照 ownerId 是 string
    timestamp,
    createdAt,
  };
};

const generateFakeProduct = ({ index, ownerId, ownerUid }) => {
  const secondsGap = 5;

  const shouldHaveImages = faker.datatype.boolean();
  const imageSnapshots = shouldHaveImages
    ? Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () =>
        generateFakeImageSnapshot(ownerId)
      )
    : [];

  return {
    title: faker.commerce.productName(),
    price: faker.commerce.price({ min: 1, max: 60000, dec: 0 }),
    inventory: faker.number.int({ min: 1, max: 100 }),
    description: faker.lorem.paragraph(),
    images: imageSnapshots,
    hasImages: imageSnapshots.length > 0,
    ownerId: new mongoose.Types.ObjectId(ownerId),
    ownerUid,
    followed: faker.number.int({ min: 0, max: 100 }),
    soldAmount: faker.number.int({ min: 0, max: 200 }),
    category: faker.helpers.arrayElement(categories),
    productType: faker.helpers.arrayElement(productTypes),
    createdAt: new Date(now.getTime() - index * secondsGap * 1000),
    updatedAt: new Date(now.getTime() - index * secondsGap * 1000),
  };
};

const run = async () => {
  try {
    const allProducts = [];

    fakeUser.forEach((user, userIndex) => {
      const { _id: ownerId, uid: ownerUid } = user;

      const userProducts = Array.from({ length: 30 }, (_, i) =>
        generateFakeProduct({
          index: userIndex * 30 + i, // 保證不同使用者也不重疊時間
          ownerId,
          ownerUid,
        })
      );

      allProducts.push(...userProducts);
    });

    await ProductModel.insertMany(allProducts);

    console.log("假商品資料成功插入", allProducts.length, "筆");
    process.exit();
  } catch (error) {
    console.error("插入失敗", error);
    process.exit(1);
  }
};

run();
