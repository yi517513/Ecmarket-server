const { authenticateUser } = require("./authenticateUser");
const { authenticateAdmin } = require("./authenticateAdmin");

// user
const requireAuth = authenticateUser({ mode: "jwt" });
const optionalAuth = authenticateUser({ mode: "optional" });

// admin
const requireAdmin = authenticateAdmin();

module.exports = {
  requireAuth,
  optionalAuth,
  requireAdmin,
};
