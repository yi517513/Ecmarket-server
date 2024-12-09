const Product = require("../models/productModel");

const getPublicProducts = async (req, res) => {
  try {
    const foundProducts = await Product.find();

    return res.send({ data: foundProducts });
  } catch (error) {
    return res.status(500).send("伺服器發生錯誤");
  }
};

const getPublicProductById = async (req, res) => {
  console.log(`getPublicProductById`);
  console.log(req.params);
  try {
    const { productId } = req.params;
    const foundProduct = await Product.findById(productId);

    console.log(foundProduct);

    return res.status(200).send({ message: null, data: foundProduct });
  } catch (error) {
    res.status(500).send("伺服器發生錯誤");
  }
};

module.exports = {
  getPublicProducts,
  getPublicProductById,
};
