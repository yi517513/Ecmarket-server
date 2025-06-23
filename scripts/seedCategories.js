require("dotenv").config();

const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const { CategoryModel } = require("../models"); // 根據實際路徑調整

// 連線資料庫
mongoose.connect(process.env.MONGODB_URI);

const categories = [
  "mapleStory",
  "genshinImpact",
  "leagueOfLegends",
  "apexLegends",
  "valorant",
  "minecraft",
  "fortnite",
  "overwatch",
  "callOfDuty",
  "hearthstone",
  "dota2",
  "pubg",
  "counterStrike",
  "roblox",
  "pokemonGo",
  "eldenRing",
  "animalCrossing",
  "lostArk",
  "starfield",
  "diablo4",
];

// 當前時間
const now = new Date();

// 產生假類別
const generateFakeCategory = (name, index) => {
  return {
    category: name,
    image: faker.image.urlLoremFlickr({ category: "games" }),
    sortOrder: index + 1,
    createdAt: new Date(now.getTime() - index * 1000),
    updatedAt: new Date(now.getTime() - index * 1000),
  };
};

const run = async () => {
  try {
    const fakeCategories = categories.map((name, i) =>
      generateFakeCategory(name, i)
    );

    await CategoryModel.deleteMany(); // 清空資料（可選）
    await CategoryModel.insertMany(fakeCategories);

    console.log("Category 假資料已成功插入！");
    process.exit();
  } catch (error) {
    console.error("Category 資料插入失敗：", error);
    process.exit(1);
  }
};

run();
