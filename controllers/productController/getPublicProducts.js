const { ProductModel } = require("../../models");

const getPublicProducts = async (req, res, next) => {
  try {
    const { category } = req.params || {};

    const { cursor, skip, limit, mode, type, min, max } = req.query || {};

    // console.log(cursor, skip, limit, mode, type, min, max);

    const query = {};
    if (category) query.category = category;
    if (type) query.productType = type;

    if (min !== undefined || max !== undefined) {
      query.price = {};
      if (min !== undefined) query.price.$gte = Number(min);
      if (max !== undefined) query.price.$lte = Number(max);
    }

    if (mode === "offset") {
      const [products, totalItems] = await Promise.all([
        ProductModel.find(query)
          .sort({ createdAt: -1, _id: -1 })
          .limit(Number(limit) || 20)
          .skip(Number(skip) || 0)
          .select("-description -images -ownerId -ownerUid -__v"),
        ProductModel.countDocuments(query),
      ]);
      // console.log(products);
      return res.json({ data: { products, totalItems }, message: null });
    }

    if (mode === "cursor") {
      const products = await ProductModel.find({
        ...query,
        ...(cursor ? { createdAt: { $lt: new Date(cursor) } } : {}),
      })
        .sort({ createdAt: -1, _id: -1 })
        .limit(Number(limit) || 20);

      const nextCursor = products[products.length - 1]?.createdAt;
      // console.log(nextCursor);
      return res.json({ data: { products, nextCursor }, message: null });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getPublicProducts };
