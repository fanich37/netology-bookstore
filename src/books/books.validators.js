const Joi = require('joi');

const BOOK_EXTENSION_REGEXP_PATTERN = '\\.txt|docx|pdf$';
const COVER_EXTENSION_REGEXP_PATTERN = '\\.jpe?g$';

const REGEXP_PATTERN_MAP = {
  'fileBook': BOOK_EXTENSION_REGEXP_PATTERN,
  'fileCover': COVER_EXTENSION_REGEXP_PATTERN,
};

const BookToCreateSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(''),
  authors: Joi.string().required(),
  favorite: Joi.string().allow(''),
  fileCover: Joi.string().pattern(new RegExp(COVER_EXTENSION_REGEXP_PATTERN, 'i')).required(),
  fileName: Joi.string().required(),
  fileBook: Joi.string().pattern(new RegExp(BOOK_EXTENSION_REGEXP_PATTERN, 'i')).required(),
});

const BookToUpdateSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string().allow(''),
  authors: Joi.string(),
  favorite: Joi.string().allow(''),
  fileCover: Joi.string().pattern(new RegExp(COVER_EXTENSION_REGEXP_PATTERN, 'i')),
  fileName: Joi.string(),
  fileBook: Joi.string().pattern(new RegExp(BOOK_EXTENSION_REGEXP_PATTERN, 'i')),
});

const fileFilter = (_, file, cb) => {
  const { originalname, fieldname } = file;
  const regexpPattern = REGEXP_PATTERN_MAP[fieldname];
  const fileExtensionRegExp = new RegExp(regexpPattern, 'i');
  const isValidFile = fileExtensionRegExp.test(originalname);

  cb(null, isValidFile);
};

exports.validateBookOnCreate = (book) => BookToCreateSchema
  .validate.call(BookToCreateSchema, book, { abortEarly: false });
exports.validateBookOnUpdate = (dataToUpdate) => BookToUpdateSchema
  .validate.call(BookToUpdateSchema, dataToUpdate, { abortEarly: false });
exports.fileFilter = fileFilter;
