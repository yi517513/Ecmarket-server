const { ProductModel } = require("../../models");

const getPrivateProducts = async (req, res, next) => {
  try {
    const { skip, limit, type, category, sort } = req.query || {};
    const currentUserId = req.user?._id;

    const query = {
      ...(category && { category }),
      ...(type && { productType: type }),
    };

    const sortMap = {
      default: { updatedAt: -1, _id: -1 }, // 預設排序（最新）
      latest: { createdAt: -1, _id: -1 }, // 最新上架
      "high-to-low": { price: -1 }, // 價格高至低
      "low-to-high": { price: 1 }, // 價格低至高
    };
    const selectedSort = sortMap[sort] || sortMap["default"];

    const [products, totalItems] = await Promise.all([
      ProductModel.find({
        ...query,
        ownerId: currentUserId,
      })
        .sort(selectedSort)
        .limit(Number(limit) || 20)
        .skip(Number(skip) || 0),
      ProductModel.countDocuments(query),
    ]);

    console.log(totalItems);

    return res.json({ data: { products, totalItems }, message: null });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPrivateProducts };
