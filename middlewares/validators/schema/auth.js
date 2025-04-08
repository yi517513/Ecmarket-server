const Joi = require("joi");

const registerSchema = Joi.object({
  body: Joi.object({
    username: Joi.string()
      .required()
      .messages({ "any.required": "USERNAME_REQUIRED" }),
    email: Joi.string().min(6).required().email().messages({
      "any.required": "EMAIL_REQUIRED",
      "string.email": "INVALID_EMAIL",
      "string.min": "EMAIL_TOO_SHORT",
    }),
    password: Joi.string().min(6).required().messages({
      "any.required": "PASSWORD_REQUIRED",
      "string.min": "PASSWORD_TOO_SHORT",
    }),
    verificationCode: Joi.string()
      .required()
      .messages({ "any.required": "VERIFICATION_CODE_REQUIRED" }),
  }),
});

const loginSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().min(6).required().email().messages({
      "any.required": "EMAIL_REQUIRED",
      "string.email": "INVALID_EMAIL",
      "string.min": "EMAIL_TOO_SHORT",
    }),
    password: Joi.string().min(6).required().messages({
      "any.required": "PASSWORD_REQUIRED",
      "string.min": "PASSWORD_TOO_SHORT",
    }),
  }),
});

const sendCodeSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().min(6).required().email().messages({
      "any.required": "EMAIL_REQUIRED",
      "string.email": "INVALID_EMAIL",
      "string.min": "EMAIL_TOO_SHORT",
    }),
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  sendCodeSchema,
};
