const { OrderModel } = require("../../models");

const getOrders = async (req, res, next) => {
  try {
    const currentUserId = req.user?._id;
    const { skip, limit, status } = req.query || {};
    const query = {
      buyer: currentUserId,
      ...(status && { status }),
    };

    const [orders, totalItems] = await Promise.all([
      OrderModel.find(query)
        .sort({ createdAt: -1, _id: -1 })
        .limit(Number(limit) || 20)
        .skip(Number(skip) || 0),
      OrderModel.countDocuments({ buyer: currentUserId, status }),
    ]);

    return res.json({ data: { orders, totalItems } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getOrders };
