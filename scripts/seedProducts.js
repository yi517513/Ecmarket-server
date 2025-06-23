require("dotenv").config();

const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const { ProductModel } = require("../models");

// 資料庫連線
mongoose.connect(process.env.MONGODB_URI);

// 固定 ownerId 與 ownerUid
const ownerId = new mongoose.Types.ObjectId("68287622e13b3a20a98a1e00");
const ownerUid = "100015";

const categories = ["mapleStory"];
const productTypes = ["account", "item", "money"];

const now = new Date();

const generateFakeImageSnapshot = () => {
  const _id = faker.string.uuid();
  const url = faker.image.url();
  const timestamp = faker.date.past();
  const createdAt = faker.date.between({ from: timestamp, to: now });

  return {
    _id,
    url,
    ownerId: ownerId.toString(), // 注意快照是 string
    timestamp,
    createdAt,
  };
};

const generateFakeProduct = (index) => {
  const secondsGap = 5;

  // 隨機決定要不要有圖片
  const shouldHaveImages = faker.datatype.boolean();
  const imageSnapshots = shouldHaveImages
    ? Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () =>
        generateFakeImageSnapshot()
      )
    : [];

  return {
    title: faker.commerce.productName(),
    price: faker.commerce.price({ min: 1, max: 60000, dec: 0 }),
    inventory: faker.number.int({ min: 1, max: 100 }),
    description: faker.lorem.paragraph(),
    images: imageSnapshots,
    hasImages: imageSnapshots.length > 0,
    ownerId,
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
    const fakeProducts = Array.from({ length: 100 }, (_, i) =>
      generateFakeProduct(i)
    );

    await ProductModel.insertMany(fakeProducts);

    console.log("✅ 假商品資料成功插入 100 筆");
    process.exit();
  } catch (error) {
    console.error("❌ 插入失敗", error);
    process.exit(1);
  }
};

run();
