const mongoose = require("mongoose");
const Product = require("../models/productModel");
const Transaction = require("../models/transactionModel");
const User = require("../models/userModel");

const getAllPublicProducts = async (req, res) => {
  try {
    const foundProducts = await Product.find().exec();
    console.log(foundProducts);
    return res.send({ data: foundProducts });
  } catch (error) {
    return res.status(500).send("伺服器發生錯誤");
  }
};

const getPublicProductById = async (req, res) => {
  console.log(`req.params: ${req.params}`);
  try {
    const { productId } = req.params;
    const foundProduct = await Product.findById(productId)
      .populate("owner", ["username", "phone"])
      .exec();

    return res.status(200).send({ message: null, data: foundProduct });
  } catch (error) {
    res.status(500).send("伺服器發生錯誤");
  }
};

module.exports = {
  getAllPublicProducts,
  getPublicProductById,
};
