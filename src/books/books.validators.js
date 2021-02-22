const Joi = require('joi');

const BookToCreateSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string(),
  authors: Joi.string().required(),
  favorite: Joi.string(),
  fileCover: Joi.string().required(),
  fileName: Joi.string().required(),
  fileBook: Joi.object({
    originalname: Joi.string().pattern(/\.txt|pdf|docx$/iu).required(),
  }).required().unknown(),
});

const BookToUpdateSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  authors: Joi.string(),
  favorite: Joi.string(),
  fileCover: Joi.string(),
  fileName: Joi.string(),
});

exports.validateBookOnCreate = (book) => BookToCreateSchema
  .validate.call(BookToCreateSchema, book, { abortEarly: false });
exports.validateBookOnUpdate = (dataToUpdate) => BookToUpdateSchema
  .validate.call(BookToUpdateSchema, dataToUpdate, { abortEarly: false });
