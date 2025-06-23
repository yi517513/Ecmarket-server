const checkMe = async (req, res, next) => {
  try {
    const { jti, role, ...user } = req.user || {};

    const isAuth = !!jti;
    const isAdmin = role === "admin";

    return res
      .status(200)
      .json({ message: null, data: { isAdmin, isAuth, user } });
  } catch (error) {
    next(error);
  }
};

module.exports = { checkMe };
