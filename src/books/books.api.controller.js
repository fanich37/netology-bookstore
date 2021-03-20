const path = require('path');
const { Router } = require('express');
const { BooksService } = require('./books.service');
const { multiPartFormDataParser, fileStorage } = require('./books.middleware');

const BooksApiController = Router();

BooksApiController.get('/', async (req, res) => {
  try {
    const result = await BooksService.getAllBooks();

    return res.json(result);
  } catch (error) {
    throw new Error('The error occured while getting all books');
  }
});

BooksApiController.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const book = await BooksService.getBookById(id);

    return book === null
      ? res.sendStatus(404)
      : res.json(book);
  } catch (error) {
    throw new Error(`The error occured while getting the book with id ${id}`);
  }
});

BooksApiController.post('/', multiPartFormDataParser, async (req, res) => {
  const { title, description, authors, favorite } = req.body;
  const { fileCover, fileBook } = req.files;

  const fileBookPath = fileBook?.[0]?.filename;
  const fileBookName = fileBook?.[0]?.originalname;
  const fileCoverPath = fileCover?.[0]?.filename;

  try {
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
  } catch (error) {
    throw new Error('The error occured while creating new book');
  }
});

BooksApiController.put('/:id', multiPartFormDataParser, async (req, res) => {
  const { id } = req.params;
  const { title, description, authors, favorite } = req.body;
  const { fileCover, fileBook } = req.files;

  const fileBookPath = fileBook?.[0]?.filename;
  const fileBookName = fileBook?.[0]?.originalname;
  const fileCoverPath = fileCover?.[0]?.filename;

  try {
    const bookToUpdate = await BooksService.getBookById(id);

    if (bookToUpdate === null) {
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
  } catch (error) {
    throw new Error(`The error occured while deleting book with id ${id}`);
  }
});

BooksApiController.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const bookToDelete = await BooksService.getBookById(id);

    if (bookToDelete === null) {
      return res.sendStatus(404);
    }

    const { fileBook, fileCover } = bookToDelete;

    fileStorage.deleteFile(fileBook);
    fileStorage.deleteFile(fileCover);
    const result = await BooksService.deleteBook(id);

    return res.json(result);
  } catch (error) {
    throw new Error(`The error occured while updating book with id ${id}`);
  }
});

BooksApiController.get('/:id/download', async (req, res) => {
  const { id } = req.params;

  try {
    const bookToDownload = await BooksService.getBookById(id);

    if (bookToDownload === null) {
      return res.sendStatus(404);
    }

    const { fileBook, fileName } = bookToDownload;
    const pathToDownload = path.join(fileStorage.storagePath, fileBook);

    return res.download(pathToDownload, fileName);
  } catch (error) {
    throw new Error(`The error occured while downloading book with id ${id}`);
  }
});

exports.BooksApiController = BooksApiController;
