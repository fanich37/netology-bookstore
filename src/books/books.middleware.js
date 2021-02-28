const multer = require('multer');
const { FileStorage } = require('../file-storage');
const { fileFilter } = require('./books.validators');

const fileStorage = new FileStorage('books');
const multiPartFormDataParser = multer({
  storage: fileStorage.storage,
  fileFilter,
}).fields([
  { name: 'fileBook', maxCount: 1 },
  { name: 'fileCover', maxCount: 1 },
]);

exports.multiPartFormDataParser = multiPartFormDataParser;
exports.fileStorage = fileStorage;
