const path = require('path');
const { DB } = require('../db');
const { FileStorage } = require('../file-storage');
const { Book } = require('./books.model');
const { validateBookOnCreate, validateBookOnUpdate } = require('./books.validators');

const booksDb = new DB('books');
const booksFileStorage = new FileStorage('books');

class BooksService {
  constructor(db, fileStorage) {
    this.db = db;
    this.fileStorage = fileStorage;
  }

  async getAllBooks() {
    try {
      const allBooks = await this.db.getAll();

      return allBooks;
    } catch (error) {
      throw new Error('The error occured while getting all books.');
    }
  }

  async getBookById(id) {
    try {
      const book = await this.db.getOneById(id);

      return book;
    } catch (error) {
      throw new Error(`The error occured while getting book with id: ${id}.`);
    }
  }

  async createBook({ title, description, authors, favorite, fileCover, fileName, fileBook }) {
    const { error } = validateBookOnCreate({
      title,
      description,
      authors,
      favorite,
      fileCover,
      fileName,
      fileBook,
    });

    if (error) {
      return { error };
    }

    const { originalname } = fileBook;
    const booksStorageDirPath = this.fileStorage.getStorageDirPath();
    const filePath = path.join(booksStorageDirPath, originalname);
    const book = new Book({
      title,
      description,
      authors,
      favorite,
      fileCover,
      fileName,
      fileBook: filePath,
    });

    return Promise.all([this.db.createRecord(book), this.fileStorage.saveFile(fileBook)])
      .then(([createdBook]) => createdBook)
      .catch(() => {
        throw new Error('The error occured while creating the new book.');
      });
  }

  async updateBook(id, data) {
    const { error, value } = validateBookOnUpdate(data);

    if (error) {
      return { error };
    }

    const bookToUpdate = await this.getBookById(id);

    if (!bookToUpdate) {
      return;
    }

    const preparedData = Object.keys(value).reduce((acc, key) => {
      const propertyToUpdate = value[key];

      return propertyToUpdate === undefined ? acc : { ...acc, [key]: propertyToUpdate };
    }, {});

    try {
      const updatedBook = await this.db.updateRecord(id, { ...bookToUpdate, ...preparedData });

      return updatedBook;
    } catch (error) {
      throw new Error(`The error occured while updating book with id: ${id}`);
    }
  }

  async deleteBook(id) {
    const book = await this.getBookById(id);

    if (book === undefined) {
      return false;
    }

    const { fileBook } = book;

    return Promise.all([this.db.deleteRecord(id), this.fileStorage.deleteFile(fileBook)])
      .then(([deleteResult]) => deleteResult)
      .catch(() => {
        throw new Error(`The error occured while deleting the book with id: ${id}`);
      });
  }
}

exports.BooksService = new BooksService(booksDb, booksFileStorage);
