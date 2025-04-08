const productService = require("../services/productService");

const getProducts = async (req, res, next) => {
  try {
    const { type, userId } = req.query;
    const currentUserId = req.user?.userId;

    const foundProducts = await productService.getProducts({
      type,
      targetUserId: userId,
      currentUserId,
    });

    return res.send({ message: null, data: foundProducts });
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const { type } = req.query;
    const { productId } = req.params;
    const currentUserId = req.user?.userId;

    const foundProduct = await productService.getProduct({
      type,
      productId,
      currentUserId,
    });

    return res.status(200).send({ message: null, data: foundProduct });
  } catch (error) {
    next(error);
  }
};

const getTracking = async (req, res, next) => {
  try {
    const { type } = req.query;
    const { productId } = req.params;
    const currentUserId = req.user?.userId;

    const foundProduct = await productService.getProduct({
      type,
      productId,
      currentUserId,
    });

    return res.status(200).send({ message: null, data: foundProduct });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const productInfo = req.body;
    const { userId: currentUserId, username: currentUsername } = req.user || {};

    const newProductId = await productService.postProduct({
      productInfo,
      currentUserId,
      currentUsername,
    });

    res.status(201).send({ data: newProductId, message: "成功新增商品" });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const updateInfo = req.body;
    const { productId } = req.params;
    const currentUserId = req.user?.userId;

    const updatedProductId = await productService.updateProduct({
      updateInfo,
      productId,
      currentUserId,
    });

    return res
      .status(200)
      .send({ data: updatedProductId, message: "成功更新商品" });
  } catch (error) {
    next(error);
  }
};

// 建立追蹤
const createTracking = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const currentUserId = req.user?.userId;

    const updatedProductId = await productService.trackProduct({
      productId,
      currentUserId,
    });

    return res
      .status(200)
      .send({ data: updatedProductId, message: "成功追蹤商品" });
  } catch (error) {
    next(error);
  }
};

// 移除追蹤
const deleteTracking = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const currentUserId = req.user?.userId;

    const updatedProductId = await productService.untrackProduct({
      productId,
      currentUserId,
    });

    return res
      .status(200)
      .send({ data: updatedProductId, message: "成功更新商品" });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const currentUserId = req.user?.userId;

    await productService.deleteProduct({ productId, currentUserId });

    return res.status(200).send({ data: null, message: "成功刪除商品" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  createTracking,
  deleteTracking,
};
