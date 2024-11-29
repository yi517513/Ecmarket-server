const Joi = require("joi");

const publishValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(3).required().messages({
      "string.min": "商品標題最少需要3個字。",
    }),
    price: Joi.number().required(),
    inventory: Joi.number().required(),
    images: Joi.any(),
    description: Joi.string().required(),
  });

  return schema.validate(data);
};

module.exports = { publishValidation };
