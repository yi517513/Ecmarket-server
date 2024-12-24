const User = require("../models/userModel");
const Product = require("../models/productModel");
const Payment = require("../models/paymentModel");
const {
  transferToPayer,
  markPaymentTransferred,
} = require("../utils/paymentHandler");
const sendSystemMessage = require("../utils/systemMessageHelper");
const notificationMediator = require("../mediators/NotificationMediator");
const productService = require("../services/productService");

const getProducts = async (req, res) => {
  try {
    const userId = req.params.userId;
    const currentUserId = req.user.id;

    const foundProducts = await productService.fetchProductsByType(
      { query: req.query },
      { userId, currentUserId }
    );

    return res.send({ message: null, data: foundProducts });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).send({ message: error.message, data: null });
  }
};

const getProductById = async (req, res) => {
  try {
    const productId = req.params.productId;
    const currentUserId = req.user.id;

    const foundProduct = await productService.fetchProductById(
      { query: req.query },
      { productId, currentUserId }
    );

    return res.status(200).send({ message: null, data: foundProduct });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).send({ message: error.message, data: null });
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
    const product = await Product.findOneAndDelete({ _id: productId });

    // 與這筆商品有關連的訂單
    const relatedPayments = await Payment.find({
      product: productId,
    }).lean();

    const payers = relatedPayments.map((payment) => payment.payer);

    if (relatedPayments.length > 0) {
      // 處理相關付款記錄
      await Promise.all(
        relatedPayments.forEach((payment) => {
          try {
            // 發送通知 - 告知已付款用戶該商品已刪除
            notificationMediator.dispatchSystemMessage({
              io,
              userIds: payment.payer,
              targetRoute: "/user-center/buyer/pre-transaction",
              type: "error",
              option: { itemTitle: payment.itemTitle },
            });
            // 退回款項
            transferToPayer(payment.payer, payment.totalAmount);
            // 標記款項已轉移
            markPaymentTransferred(payment);
          } catch (error) {
            console.error(
              `處理付款記錄失敗，付款ID: ${payment._id}, 錯誤: `,
              error.message
            );
          }
        })
      );
    }

    return res.status(200).send({ data: null, message: "成功刪除商品" });
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
