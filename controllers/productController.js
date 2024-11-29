const User = require("../models/userModel");
const Product = require("../models/productModel");

const postProduct = async (req, res) => {
  try {
    const { title, price, inventory, images, description } = req.body;
    const owner = req.user.id;

    // console.log(req.body);
    const newProduct = new Product({
      title,
      price,
      inventory,
      description,
      images,
      owner,
    });

    await newProduct.save();

    await User.findByIdAndUpdate(owner, {
      $push: { products: newProduct._id },
    });

    res.status(201).send({ data: newProduct._id, message: "成功新增商品" });
  } catch (error) {
    console.log(error);
    res.status(500).send("新增商品失敗");
  }
};

const getUserProducts = async (req, res) => {
  try {
    const owner = req.user.id;
    const foundProducts = await Product.find({ owner }).exec();
    console.log(foundProducts);
    return res.send({ message: null, data: foundProducts });
  } catch (error) {
    return res.status(500).send("伺服器發生錯誤");
  }
};

const getProductById = async (req, res) => {
  const userId = req.user.id;
  console.log(`userId: ${userId}`);
  try {
    const { productId } = req.params;
    const foundProduct = await Product.findById(productId)
      .populate("owner", ["username", "phone"])
      .exec();

    const owner = foundProduct.owner._id.toString();
    if (userId !== owner) {
      return res.status(401).send({ message: "Unauthorized", data: null });
    }

    return res.status(200).send({ message: null, data: foundProduct });
  } catch (error) {
    res.status(500).send("伺服器發生錯誤");
  }
};

const editProduct = async (req, res) => {
  try {
    console.log(req.body);
    const { title, price, inventory, images, description } = req.body;
    const { productId } = req.params;

    const editProduct = await Product.findByIdAndUpdate(
      { _id: productId },
      { title, price, inventory, images, description },
      { new: true }
    );

    return res
      .status(200)
      .send({ data: editProduct._id, message: "成功更新商品" });
  } catch (error) {
    return res.status(500).send("伺服器發生錯誤");
  }
};

const deleteProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    const foundProductAndDelete = await Product.findByIdAndDelete(productId);
    return res
      .status(200)
      .send({ data: foundProductAndDelete._id, message: "成功刪除商品" });
  } catch (error) {
    return res.status(500).send("伺服器發生錯誤");
  }
};

module.exports = {
  postProduct,
  getUserProducts,
  getProductById,
  editProduct,
  deleteProduct,
};
