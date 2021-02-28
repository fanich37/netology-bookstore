const path = require('path');
const { Router } = require('express');
const { BooksService } = require('./books.service');
const { multiPartFormDataParser, fileStorage } = require('./books.middleware');

const BooksApiController = Router();

BooksApiController.get('/', async (req, res) => {
  const result = await BooksService.getAllBooks();

  return res.json(result);
});

BooksApiController.get('/:id', async (req, res) => {
  const { id } = req.params;

  const book = await BooksService.getBookById(id);

  return book === undefined
    ? res.sendStatus(404)
    : res.json(book);
});

BooksApiController.post('/', multiPartFormDataParser, async (req, res) => {
  const { title, description, authors, favorite } = req.body;
  const { fileCover, fileBook } = req.files;

  const fileBookPath = fileBook?.[0]?.filename;
  const fileBookName = fileBook?.[0]?.originalname;
  const fileCoverPath = fileCover?.[0]?.filename;

  const result = await BooksService.createBook({
    title,
    description,
    authors,
    favorite,
    fileCover: fileCoverPath,
    fileName: fileBookName,
    fileBook: fileBookPath,
  });

  if ('error' in result) {
    if (fileBookPath) {
      fileStorage.deleteFile(fileBookPath);
    }

    if (fileCoverPath) {
      fileStorage.deleteFile(fileCoverPath);
    }

    return res.status(400).json(result.error.details);
  }

  return res.json(result);
});

BooksApiController.put('/:id', multiPartFormDataParser, async (req, res) => {
  const { id } = req.params;
  const { title, description, authors, favorite } = req.body;
  const { fileCover, fileBook } = req.files;

  const fileBookPath = fileBook?.[0]?.filename;
  const fileBookName = fileBook?.[0]?.originalname;
  const fileCoverPath = fileCover?.[0]?.filename;

  const bookToUpdate = await BooksService.getBookById(id);

  if (bookToUpdate === undefined) {
    if (fileBookPath) {
      fileStorage.deleteFile(fileBookPath);
    }

    if (fileCoverPath) {
      fileStorage.deleteBook(fileCoverPath);
    }

    return res.sendStatus(404);
  }

  const result = await BooksService.updateBook(id, {
    title,
    description,
    authors,
    favorite,
    fileCover: fileCoverPath,
    fileName: fileBookName,
    fileBook: fileBookPath,
  });

  return 'error' in result
    ? res.status(400).json(result.error.details)
    : res.json(result);
});

BooksApiController.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const bookToDelete = await BooksService.getBookById(id);

  if (bookToDelete === undefined) {
    return res.sendStatus(404);
  }

  const { fileBook, fileCover } = bookToDelete;

  fileStorage.deleteFile(fileBook);
  fileStorage.deleteFile(fileCover);
  const result = await BooksService.deleteBook(id);

  return res.json(result);
});

BooksApiController.get('/:id/download', async (req, res) => {
  const { id } = req.params;

  const bookToDownload = await BooksService.getBookById(id);

  if (bookToDownload === undefined) {
    return res.sendStatus(404);
  }

  const { fileBook, fileName } = bookToDownload;
  const pathToDownload = path.join(fileStorage.storagePath, fileBook);

  return res.download(pathToDownload, fileName);
});

exports.BooksApiController = BooksApiController;
