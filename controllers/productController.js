const User = require("../models/userModel");
const Product = require("../models/productModel");

const getProducts = async (req, res) => {
  try {
    const { type } = req.query; // 查詢參數，表示查詢類型
    // 檢查是否為有效的類型
    if (!["public", "shop", "seller"].includes(type)) {
      return res.status(400).send({ message: "無效的查詢類型", data: null });
    }

    let foundProducts;

    switch (type) {
      case "public":
        // 查詢所有公開商品
        foundProducts = await Product.find();
        break;
      case "shop":
        // 查詢某用戶出售中的商品
        const { userId: targetUserId } = req.params;
        foundProducts = await Product.find({ "owner.userId": targetUserId });
        break;
      case "seller":
        // 查詢已驗證用戶出售中的商品（庫存大於 0）
        const authenticatedUserId = req.user.id;
        foundProducts = await Product.find(
          { "owner.userId": authenticatedUserId },
          { inventory: { $gt: 0 } }
        );
        break;
    }

    // // 查詢每個商品是否有未完成交易
    // const productsWithPendingStatus = await Promise.all(
    //   foundProducts.map(async (product) => {
    //     const hasPendingTransactions = await Transaction.exists({
    //       productId: product._id,
    //       shipmentStatus: "pending",
    //     });

    //     return {
    //       ...product.toObject(),
    //       hasPending: !!hasPendingTransactions,
    //     };
    //   })
    // );

    return res.send({ message: null, data: foundProducts });
  } catch (error) {
    return res.status(500).send("伺服器發生錯誤");
  }
};

const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const { type } = req.query;

    if (!["single", "edit"].includes(type)) {
      return res.status(400).send({ message: "無效的查詢類型", data: null });
    }

    const foundProduct = await Product.findById(productId);

    if (!foundProduct) {
      return res.status(404).send({ message: "商品不存在", data: null });
    }

    // 如果用途是編輯，需要檢查用戶權限
    if (type === "edit") {
      const userId = req.user.id;
      const ownerId = foundProduct.owner.userId;

      // 判斷是否為商品擁有者
      if (userId !== ownerId) {
        return res.status(403).send({ message: "無權限訪問", data: null });
      }
    }

    return res.status(200).send({ message: null, data: foundProduct });
  } catch (error) {
    res.status(500).send("伺服器發生錯誤");
  }
};

const postProduct = async (req, res) => {
  try {
    const { title, price, inventory, images, description } = req.body;
    const { id, username } = req.user;

    const newProduct = new Product({
      title,
      price,
      inventory,
      description,
      images,
      owner: {
        userId: id,
        username,
      },
    });

    await newProduct.save();

    await User.updateOne({ _id: id }, { $push: { products: newProduct._id } });

    res.status(201).send({ data: newProduct._id, message: "成功新增商品" });
  } catch (error) {
    console.error(error);
    res.status(500).send("新增商品失敗");
  }
};

const editProduct = async (req, res) => {
  try {
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
  getProducts,
  getProductById,
  postProduct,
  editProduct,
  deleteProduct,
};
