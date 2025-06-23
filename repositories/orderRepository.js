const orderModel = require("../models/orderModel");

class OrderRepository {
  constructor(model) {
    this.db = model;
  }

  /**
   * 根據 userId 和狀態查詢用戶的訂單
   * @param {Object} params - 查詢參數
   * @param {Object} params.queryWithStatus - 用於查詢訂單狀態的條件
   * @param {string} params.userId - 用戶的 ID
   * @param {string} params.role - 用戶 ID 所對應的字段名（例如：`buyer` 或 `seller` 等）
   * @returns {Promise<Array>} - 查詢到的訂單列表，返回的訂單會包含與 `product` 的關聯（但只會返回 `__v` 字段），若找不到符合條件的訂單，返回空數組
   */
  async findOrdersByUserAndRole({ filter, userId, role }) {
    return await this.db
      .find({ [role]: userId, ...filter })
      .populate({ path: "product", select: "-__v" });
  }

  /**
   * 根據訂單 ID 查詢訂單並檢查擁有者
   * @param {Object} params - 查詢參數
   * @param {string} params.userId - 用戶的 ID
   * @param {string} params.orderId - 訂單的 ID
   * @param {string} params.role - 用戶在訂單中的角色（例如：`buyer` 或 `seller`）
   * @returns {Promise<Object|null>} - 查詢到的訂單資料，如果找不到則返回 null
   */
  async findOrderById({ userId, orderId, role }) {
    return await this.db.findOne({ _id: orderId, [role]: userId });
  }

  /**
   * 取消尚未付款狀態的訂單
   * @param {Object} params - 查詢參數
   * @param {string} params.currentUserId - 用戶的 ID
   * @param {string} params.orderId - 訂單的 ID
   * @returns {Promise<void>} - 無返回值
   */
  async cancelUnpaidOrder({ userId, orderId }) {
    await this.db.deleteOne({ _id: orderId, buyer: userId });
    await this.deleteByIdIfOwner({
      itemId: orderId,
      owner: currentUserId,
      ownerField: "buyer",
    });
  }

  /**
   * 取消已付款的訂單
   * @param {Object} params - 查詢參數
   * @param {string} params.currentUserId - 用戶的 ID
   * @param {string} params.orderId - 訂單的 ID
   * @returns {Promise<void>} - 無返回值
   */
  async cancelPaidOrder({ currentUserId, orderId }) {
    await this.updateByIdIfOwner({
      itemId: orderId,
      updateFields: { $set: { orderStatus: "canceled" } },
      owner: currentUserId,
      ownerField: "buyer",
    });
  }

  /**
   * 用戶請求取消訂單
   * @param {Object} params - 查詢參數
   * @param {string} params.currentUserId - 用戶的 ID
   * @param {string} params.orderId - 訂單的 ID
   * @param {string} params.role - 用戶在訂單中的角色（例如：`buyer` 或 `seller`）
   * @returns {Promise<void>} - 無返回值
   */
  async requestCancel({ currentUserId, orderId, role }) {
    await this.updateByIdIfOwner({
      itemId: orderId,
      updateFields: { $set: { cancelRequest: role } },
      owner: currentUserId,
      ownerField: role,
    });
  }

  /**
   * 確認訂單取消
   * @param {Object} params - 查詢參數
   * @param {string} params.currentUserId - 用戶的 ID
   * @param {string} params.orderId - 訂單的 ID
   * @param {string} params.role - 用戶在訂單中的角色（例如：`buyer` 或 `seller`）
   * @returns {Promise<void>} - 無返回值
   */
  async confirmCancel({ currentUserId, orderId, role }) {
    await this.updateByIdIfOwner({
      itemId: orderId,
      updateFields: {
        $set: { orderStatus: "canceled", cancelRequest: "both" },
      },
      owner: currentUserId,
      ownerField: role,
    });
  }
}

const orderRepository = new OrderRepository(orderModel);
module.exports = orderRepository;
