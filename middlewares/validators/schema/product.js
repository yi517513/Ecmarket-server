const Joi = require("joi");

const getPublicSchema = Joi.object({
  query: Joi.object({
    type: Joi.string().valid("public", "user").required().messages({
      "any.required": "QUERY_REQUIRED",
      "any.only": "TYPE_MUST_BE_PUBLIC_OR_USER",
    }),
    userId: Joi.when("type", {
      is: "user",
      then: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
          "any.required": "PRODUCT_ID_REQUIRED",
          "string.pattern.base": "INVALID_PARAMS",
        }),
      otherwise: Joi.forbidden(),
    }),
  }),
});

module.exports = {
  getPublicSchema,
};
