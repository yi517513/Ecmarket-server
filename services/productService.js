class ProductService {
  constructor(productModel) {
    this.db = productModel;
  }

  async fetchProductsByType(query = {}, params = {}) {
    const { type } = query || {}; // 查詢參數，表示查詢類型
    // 檢查是否為有效的類型
    if (!["public", "shop", "seller"].includes(type)) {
      throw new Error('"無效的查詢類型"');
    }

    switch (type) {
      case "public":
        // 查詢所有公開商品
        return await this.getProducts();
      case "shop":
        // 查詢某用戶出售中的商品
        return await this.getProducts({ "owner.userId": params.userId });
      case "seller":
        // 查詢已驗證用戶出售中的商品
        return await this.getProducts({ "owner.userId": params.currentUserId });
      default:
        throw new Error("Invalid type");
    }
  }

  async fetchProductById(query = {}, params = {}) {
    const { type } = query || {}; // 查詢參數，表示查詢類型

    // 檢查是否為有效的類型
    if (!["single", "edit"].includes(type)) {
      throw new Error('"無效的查詢類型"');
    }

    const foundProduct = await this.getProductById(params.productId);

    if (!foundProduct) {
      throw new Error("商品不存在");
    }

    // 如果用途是編輯，需要檢查用戶權限
    if (type === "edit") {
      // 判斷是否為商品擁有者
      if (params.currentUserId !== foundProduct.owner.userId) {
        throw new Error("無權限訪問");
      }
    }

    return foundProduct;
  }

  async getProductById(productId) {
    try {
      const product = await this.db.findById(productId);

      return product;
    } catch (error) {
      console.error("getProductById發生錯誤，" + error.message);
      throw new Error("搜尋商品發生錯誤");
    }
  }

  async getProducts(filter) {
    try {
      const product = await this.db.find(filter);

      return product;
    } catch (error) {
      console.error("getProductById發生錯誤，" + error.message);
      throw new Error("搜尋商品發生錯誤");
    }
  }
}

const productService = new ProductService();
module.exports = productService;
