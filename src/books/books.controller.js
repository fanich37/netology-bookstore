const { Router } = require('express');
const multer = require('multer');
const { FileStorage } = require('../file-storage');
const { BooksService } = require('./books.service');
const { fileFilter } = require('./books.validators');

const BooksController = Router();
const fileStorage = new FileStorage('books');
const multiPartFormDataParser = multer({
  storage: fileStorage.storage,
  fileFilter,
}).single('fileBook');

BooksController.get('/', async (req, res) => {
  const result = await BooksService.getAllBooks();

  return res.json(result);
});

BooksController.get('/:id', async (req, res) => {
  const { id } = req.params;
  const result = await BooksService.getBookById(id);

  return result === undefined
    ? res.sendStatus(404)
    : res.json(result);
});

BooksController.post('/', multiPartFormDataParser, async (req, res) => {
  const { title, description, authors, favorite, fileCover, fileName } = req.body;
  const { file: fileBook } = req;

  const filePath = fileBook?.path;
  const result = await BooksService.createBook({
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook: filePath,
  });

  if ('error' in result) {
    if (filePath) {
      fileStorage.deleteFile(filePath);
    }

    return res.status(400).json(result.error.details);
  }

  return res.json(result);
});

BooksController.put('/:id', multiPartFormDataParser, async (req, res) => {
  const { id } = req.params;
  const { title, description, authors, favorite, fileCover, fileName } = req.body;
  const { file: fileBook } = req;

  const filePath = fileBook?.path;
  const result = await BooksService.updateBook(id, {
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook: filePath,
  });

  if (result === undefined) {
    if (filePath) {
      fileStorage.deleteFile(filePath);
    }

    return res.sendStatus(404);
  }

  return 'error' in result
    ? res.status(400).json(result.error.details)
    : res.json(result);
});

BooksController.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const bookToDelete = await BooksService.getBookById(id);

  if (bookToDelete === undefined) {
    return res.sendStatus(404);
  }

  const { fileBook } = bookToDelete;

  fileStorage.deleteFile(fileBook);
  const result = await BooksService.deleteBook(id);

  return res.json(result);
});

BooksController.get('/:id/download', async (req, res) => {
  const { id } = req.params;
  const result = await BooksService.getBookById(id);

  if (result === undefined) {
    return res.sendStatus(404);
  }

  const { fileBook } = result;

  return res.download(fileBook);
});

exports.BooksController = BooksController;
