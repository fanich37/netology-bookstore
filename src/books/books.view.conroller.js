const { Router } = require('express');
const { fetchData, prepareFormErrors } = require('../utils');
const { BooksService } = require('./books.service');
const { multiPartFormDataParser, fileStorage } = require('./books.middleware');
const { textFields, fileFields } = require('./books.form');
const { VIEWS_COUNTER_URL } = process.env;

const BooksViewController = Router();

BooksViewController.get('/', async (req, res) => {
  try {
    const books = await BooksService.getAllBooks();

    return res.render('index', { pageTitle: 'All books', books, currentRoute: '/' });
  } catch (error) {
    throw new Error('The error occured while getting all books');
  }
});

BooksViewController.get('/create', (_, res) => res.render('book-form', {
  pageTitle: 'Create new book',
  currentRoute: 'Create new book',
  textFields,
  fileFields,
  book: null,
  errors: null,
  formAction: '/create',
  actionName: 'Create book',
}));

BooksViewController.post('/create', multiPartFormDataParser, async (req, res) => {
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

      const errors = prepareFormErrors(result.error);

      return res.status(400).render('book-form', {
        pageTitle: 'Add new book',
        currentRoute: 'Create new book',
        textFields,
        fileFields,
        book: null,
        errors,
        formAction: '/create',
        actionName: 'Create book',
      });
    }

    return res.redirect(301, `/${result.id}`);
  } catch (error) {
    throw new Error('The error occured while creating new book');
  }
});

BooksViewController.get('/:id', async (req, res) => {
  const { id } = req.params;
  const viewsCounterUrl = `${VIEWS_COUNTER_URL}/counter/${id}/incr`;

  try {
    const book = await BooksService.getBookById(id);

    if (book === null) {
      return res.status(404).render('not-found', { pageTitle: 'Not found', currentRoute: 'Not found' });
    }

    let views;

    try {
      views = await fetchData(viewsCounterUrl, { method: 'POST' });
    } catch (error) {
      views = 'not available';
    }

    const { title } = book;

    return res.render('book-card', {
      pageTitle: title,
      book,
      views,
      currentRoute: title,
    });
  } catch (error) {
    throw new Error(`The error occured while getting book with id ${id}`);
  }
});

BooksViewController.get('/:id/update', async (req, res) => {
  const { id } = req.params;

  try {
    const book = await BooksService.getBookById(id);

    if (book === null) {
      return res.status(404).render('not-found', { pageTitle: 'Not found', currentRoute: 'Not found' });
    }

    return res.render('book-form', {
      pageTitle: `Update ${book.title}`,
      currentRoute: `Update ${book.title}`,
      textFields,
      fileFields,
      book,
      errors: null,
      formAction: `/${id}/update`,
      actionName: 'Update book',
    });
  } catch (error) {
    throw new Error(`The error occured while getting the book with id ${id}`);
  }
});

BooksViewController.post('/:id/update', multiPartFormDataParser, async (req, res) => {
  const { id } = req.params;
  const { title, description, authors, favorite } = req.body;
  const { fileCover, fileBook } = req.files;

  const fileBookPath = fileBook?.[0]?.filename;
  const fileBookName = fileBook?.[0]?.originalname;
  const fileCoverPath = fileCover?.[0]?.filename;

  try {
    const book = await BooksService.updateBook(id, {
      title,
      description,
      authors,
      favorite,
      fileCover: fileCoverPath,
      fileName: fileBookName,
      fileBook: fileBookPath,
    });

    if ('error' in book) {
      if (fileBookPath) {
        fileStorage.deleteFile(fileBookPath);
      }

      if (fileCoverPath) {
        fileStorage.deleteFile(fileCoverPath);
      }

      const errors = prepareFormErrors(book.error);

      return res.status(400).render('book-form', {
        pageTitle: `Update ${book.title}`,
        currentRoute: `Update ${book.title}`,
        textFields,
        fileFields,
        book,
        errors,
        formAction: `/${id}/update`,
        actionName: 'Update book',
      });
    }

    return res.redirect(301, `/${id}`);
  } catch (error) {
    throw new Error(`The error occured while updating the book with id ${id}`);
  }
});

BooksViewController.post('/:id/delete', async (req, res) => {
  const { id } = req.params;

  try {
    const bookToDelete = await BooksService.getBookById(id);

    if (bookToDelete === null) {
      return res.status(404).render('not-found', { pageTitle: 'Not found', currentRoute: 'Not found' });
    }

    const { fileBook, fileCover } = bookToDelete;

    fileStorage.deleteFile(fileBook);
    fileStorage.deleteFile(fileCover);
    await BooksService.deleteBook(id);

    return res.redirect(301, '/');
  } catch (error) {
    throw new Error(`The error occured while deleting the book with id ${id}`);
  }
});

exports.BooksViewController = BooksViewController;
