const Joi = require('joi');

const UserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi
    .string()
    .min(3)
    .max(10)
    .required(),
});

exports.validateUser = (user) => UserSchema
  .validate.call(UserSchema, user, { abortEarly: false });
