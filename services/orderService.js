const orderRepository = require("../repository/orderRepository");
const {
  InternalServerError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} = require("../errors/httpErrors");

class OrderService {
  constructor(orderRepository) {
    this.orderRepo = orderRepository;
  }

  async getOrders({ status, role, currentUserId }) {
    if (!status) throw new InternalServerError("缺少操作類型");
    if (!role) throw new InternalServerError("缺少操作身分");
    if (!currentUserId) throw new InternalServerError("缺少使用者 ID");

    let filter;

    switch (status) {
      case "unpaid":
        filter = { orderStatus: "unpaid" };
        break;
      case "paid-without-trade":
        filter = { orderStatus: "paid" };
        break;
      case "ongoing":
        filter = { orderStatus: "ongoing" };
        break;
      case "shipped":
        filter = { orderStatus: "shipped" };
        break;
      case "completed":
        filter = { orderStatus: "completed" };
        break;
      case "canceled":
        filter = { orderStatus: "canceled" };
        break;
    }

    const foundOrders = await this.orderRepo.findOrdersByUserAndRole({
      filter,
      userId: currentUserId,
      role,
    });

    return foundOrders;
  }

  async getOrderDetail({ role, orderId, currentUserId }) {
    if (!role || role !== "buyer") throw new InternalServerError("錯誤身分");
    if (!orderId) throw new InternalServerError("缺少訂單編號");
    if (!currentUserId) throw new InternalServerError("缺少使用者 ID");

    const foundOrder = await this.orderRepo.findOrderById({
      orderId,
      userId: currentUserId,
      role,
    });

    return foundOrder;
  }

  async createOrder({ orderInfo = {}, seller = {}, currentUserId }) {
    if (!currentUserId) throw new InternalServerError("缺少使用者 ID");

    const { _id, price, quantity, title } = orderInfo;
    if (!_id || !price || !quantity || !title) {
      throw new InternalServerError("缺少訂單資訊");
    }

    const { userId } = seller;
    if (!userId) throw new InternalServerError("缺少賣家 ID");

    const newOrder = await this.orderRepo.create({
      buyer: currentUserId,
      seller: userId,
      product: _id,
      itemQuantity: quantity,
      itemPrice: price,
      itemTitle: title,
      totalAmount: price * quantity,
    });

    return newOrder._id;
  }

  async cancelOrder({ role, orderId, currentUserId }) {
    if (!role) throw new InternalServerError("缺少操作身分");
    if (!orderId) throw new InternalServerError("缺少訂單編號");
    if (!currentUserId) throw new InternalServerError("缺少使用者 ID");

    const foundOrder = await this.orderRepo.findOrderById({
      userId: currentUserId,
      orderId,
      role,
    });

    if (!foundOrder) throw new NotFoundError("找不到訂單");

    const { orderStatus, cancelRequest } = foundOrder;

    switch (orderStatus) {
      case "unpaid":
        if (role !== "buyer") throw ForbiddenError("無效請求");

        await this.orderRepo.cancelUnpaidOrder({
          userId: currentUserId,
          orderId,
        });
        return;
      case "paid":
        await this.orderRepo.cancelPaidOrder({ currentUserId, orderId });
        // eventBus 進行退款
        break;
      case "ongoing":
        if (cancelRequest === "none") {
          await this.orderRepo.requestCancel({ currentUserId, orderId, role });
          // eventBus 通知對方
        } else if (cancelRequest !== role && cancelRequest !== "none") {
          await this.orderRepo.confirmCancel({ currentUserId, orderId, role });
          // eventBus 進行退款
        } else {
          throw new ConflictError("已為取消的訂單");
        }
        break;
      default:
        throw new ConflictError("當前狀態無法取消，請聯繫客服");
    }
  }
}

const orderService = new OrderService(orderRepository);
module.exports = orderService;
