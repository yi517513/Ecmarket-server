const { deleteProduct } = require("./deleteProduct");
const { getPrivateProduct } = require("./getPrivateProduct");
const { getPrivateProducts } = require("./getPrivateProducts");
const { getProductDetail } = require("./getProductDetail");
const { getPublicProducts } = require("./getPublicProducts");
const { createProduct } = require("./createProduct");
const { updateProduct } = require("./updateProduct");

module.exports = {
  getPublicProducts,
  getProductDetail,
  getPrivateProducts,
  getPrivateProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
