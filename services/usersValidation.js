const Joi = require("joi");
const { HttpCode} = require("../helpers/constants");

const schemaAddUser = Joi.object({
  name: Joi.string()
    .min(3)
    .max(30)
    //.pattern(/[A-Z]\w+/)
    .optional(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
 });

const schemaLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});


const schemaResendingEmail = Joi.object({
  email: Joi.string().email().required(),
  //   .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "ua"] } })
  //   .required(),
});

const validate = async (schema, obj, next) => {
  try {
    await schema.validateAsync(obj);
    return next();
  } catch (err) {
    next({
      status: "err",
      code: HttpCode.BAD_REQUEST,
      message: `Field ${err.message.replace(/"/g, "")}`,
    });
  }
};

module.exports.validateCreateUser = (req, _res, next) => {
  return validate(schemaAddUser, req.body, next);
};

module.exports.validateSubscriptionUpdate = (req, _res, next) => {
  return validate(schemaUpdateSubscriptionUser, req.body, next);
};

module.exports.validateLogin = (req, _res, next) => {
  return validate(schemaLogin, req.body, next);
};

module.exports.validateResendingEmail = (req, _res, next) => {
  return validate(schemaResendingEmail, req.body, next);
};

