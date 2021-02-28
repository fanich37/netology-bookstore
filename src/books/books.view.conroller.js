const { Router } = require('express');
const { BooksService } = require('./books.service');
const { multiPartFormDataParser, fileStorage } = require('./books.middleware');
const { textFields, fileFields, prepareFormErrors } = require('./books.form');

const BooksViewController = Router();

BooksViewController.get('/', async (req, res) => {
  const books = await BooksService.getAllBooks();

  return res.render('index', { pageTitle: 'All books', books, currentRoute: '/' });
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
});

BooksViewController.get('/:id', async (req, res) => {
  const { id } = req.params;

  const book = await BooksService.getBookById(id);

  if (book === undefined) {
    return res.status(404).render('not-found', { pageTitle: 'Not found', currentRoute: 'Not found' });
  }

  const { title } = book;

  return res.render('book-card', {
    pageTitle: title,
    book,
    currentRoute: title,
  });
});

BooksViewController.get('/:id/update', async (req, res) => {
  const { id } = req.params;

  const book = await BooksService.getBookById(id);

  if (book === undefined) {
    return res.status(404).render('not-found', { pageTitle: 'Not found', currentRoute: 'Not found' });
  }

  return res.render('book-form', {
    pageTitle: `Update ${book.title}`,
    currentRoute: `Update ${book.title}`,
    textFields,
    fileFields,
    book,
    errors: null,
    formAction: `/${book.id}/update`,
    actionName: 'Update book',
  });
});

BooksViewController.post('/:id/update', multiPartFormDataParser, async (req, res) => {
  const { id } = req.params;
  const { title, description, authors, favorite } = req.body;
  const { fileCover, fileBook } = req.files;

  const fileBookPath = fileBook?.[0]?.filename;
  const fileBookName = fileBook?.[0]?.originalname;
  const fileCoverPath = fileCover?.[0]?.filename;

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
      formAction: `/${book.id}/update`,
      actionName: 'Update book',
    });
  }

  return res.redirect(301, `/${book.id}`);
});

BooksViewController.post('/:id/delete', async (req, res) => {
  const { id } = req.params;

  const bookToDelete = await BooksService.getBookById(id);

  if (bookToDelete === undefined) {
    return res.status(404).render('not-found', { pageTitle: 'Not found', currentRoute: 'Not found' });
  }

  const { fileBook, fileCover } = bookToDelete;

  fileStorage.deleteFile(fileBook);
  fileStorage.deleteFile(fileCover);
  await BooksService.deleteBook(id);

  return res.redirect(301, '/');
});

exports.BooksViewController = BooksViewController;
