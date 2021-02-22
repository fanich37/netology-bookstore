const { Router } = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const { BooksService } = require('./books.service');

const BooksController = Router();
const urlEncodedParser = bodyParser.urlencoded({ extended: false });
const multiPartFormDataParser = multer().single('fileBook');

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

  const result = await BooksService.createBook({
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook,
  });

  return 'error' in result
    ? res.status(400).json(result.error.details)
    : res.json(result);
});

BooksController.put('/:id', urlEncodedParser, async (req, res) => {
  const { id } = req.params;
  const { title, description, authors, favorite, fileCover, fileName } = req.body;

  const result = await BooksService.updateBook(id, {
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
  });

  if (result === undefined) {
    return res.sendStatus(404);
  }

  return 'error' in result
    ? res.status(400).json(result.error.details)
    : res.json(result);
});

BooksController.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const result = await BooksService.deleteBook(id);

  return result
    ? res.json(result)
    : res.status(404).json(result);
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
