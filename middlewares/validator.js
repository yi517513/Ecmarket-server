const {
  registerValidation,
  loginValidation,
} = require("../validators/authValidator");
const { postValidation } = require("../validators/postValidation");

class Validators {
  register = (req, res, next) => {
    const { error } = registerValidation(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    next();
  };
  login = (req, res, next) => {
    const { error } = loginValidation(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    next();
  };
  postProduct = (req, res, next) => {
    const { error } = postValidation(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    next();
  };
}

const validators = new Validators();
module.exports = validators;
