const mongoose = require("mongoose");

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000, // 設置30秒超時
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // 無法連線時終止應用程式
  }
};

module.exports = connectMongoDB;
