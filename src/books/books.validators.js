const Joi = require('joi');

const BOOK_EXTENSION_REGEXP_PATTERN = '\\.txt|docx|pdf$';

const BookToCreateSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string(),
  authors: Joi.string().required(),
  favorite: Joi.string(),
  fileCover: Joi.string().required(),
  fileName: Joi.string().required(),
  fileBook: Joi.string().pattern(new RegExp(BOOK_EXTENSION_REGEXP_PATTERN, 'i')).required(),
});

const BookToUpdateSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  authors: Joi.string(),
  favorite: Joi.string(),
  fileCover: Joi.string(),
  fileName: Joi.string(),
  fileBook: Joi.string().pattern(new RegExp(BOOK_EXTENSION_REGEXP_PATTERN, 'i')),
});

const fileFilter = (_, file, cb) => {
  const { originalname } = file;
  const fileExtensionRegExp = new RegExp(BOOK_EXTENSION_REGEXP_PATTERN, 'i');
  const isValidFile = fileExtensionRegExp.test(originalname);

  cb(null, isValidFile);
};

exports.validateBookOnCreate = (book) => BookToCreateSchema
  .validate.call(BookToCreateSchema, book, { abortEarly: false });
exports.validateBookOnUpdate = (dataToUpdate) => BookToUpdateSchema
  .validate.call(BookToUpdateSchema, dataToUpdate, { abortEarly: false });
exports.fileFilter = fileFilter;
