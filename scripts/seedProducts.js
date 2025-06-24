require("dotenv").config();

const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const { ProductModel } = require("../models");
const { user } = require("./user");

// 資料庫連線
mongoose.connect(process.env.MONGODB_URI);

const categories = ["mapleStory", "LoL"];
const productTypes = ["account", "item", "money"];
const now = new Date();

const generateFakeImageSnapshot = () => {
  const _id = faker.string.uuid();
  const url = `https://picsum.photos/640/480?random=${faker.number.int(99999)}`;
  const createdAt = faker.date.recent({ days: 10 });

  return {
    _id,
    url,
    createdAt,
  };
};

const generateFakeProduct = ({
  index,
  ownerId,
  ownerUid,
  forceHighPrice = false,
}) => {
  const secondsGap = 5;

  // 有 70% 機率產生圖片
  const shouldHaveImages = Math.random() < 0.7;
  const imageSnapshots = shouldHaveImages
    ? Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () =>
        generateFakeImageSnapshot()
      )
    : [];

  const price = forceHighPrice
    ? faker.number.int({ min: 50000, max: 100000 })
    : faker.number.int({ min: 1, max: 49999 });

  return {
    title: faker.commerce.productName(),
    price,
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

    // 只處理 user index 2~4（也就是 user[2], user[3], user[4]）
    user.slice(2, 5).forEach((user, userIndex) => {
      const { _id: ownerId, uid: ownerUid } = user;

      // 生成 30 筆價格小於 50000 的商品
      const normalProducts = Array.from({ length: 30 }, (_, i) =>
        generateFakeProduct({
          index: userIndex * 30 + i, // 保證不同使用者也不重疊時間
          ownerId,
          ownerUid,
        })
      );

      // 生成 1 筆價格 >= 50000 的商品
      const highPriceProduct = generateFakeProduct({
        index: userIndex * 100 + 30,
        ownerId,
        ownerUid,
        forceHighPrice: true,
      });

      allProducts.push(...normalProducts, highPriceProduct);
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
