const requestValidator = require("./requestValidator");

const { getPublicSchema } = require("./schema/product");

const {
  registerSchema,
  loginSchema,
  sendCodeSchema,
} = require("./schema/auth");

const productRouteSchemaMapping = {
  "GET /api/product": getPublicSchema,
};

const authRouteSchemaMapping = {
  "POST /api/auth/login": loginSchema,
  "POST /api/auth/register": registerSchema,
  "POST /api/auth/send-code": sendCodeSchema,
};

const productValidation = requestValidator(productRouteSchemaMapping);
const authValidation = requestValidator(authRouteSchemaMapping);

module.exports = { productValidation, authValidation };
