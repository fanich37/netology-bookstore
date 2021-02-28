const { DB } = require('../db');
const { Book } = require('./books.model');
const { validateBookOnCreate, validateBookOnUpdate } = require('./books.validators');

const booksDb = new DB('books');

class BooksService {
  constructor(db) {
    this.db = db;
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

    const book = new Book({
      title,
      description,
      authors,
      favorite,
      fileCover,
      fileName,
      fileBook,
    });

    try {
      const createdBook = this.db.createRecord(book);

      return createdBook;
    } catch (error) {
      throw new Error('The error occured while creating the new book.');
    }
  }

  async updateBook(id, data) {
    const { error, value } = validateBookOnUpdate(data);

    if (error) {
      return { error };
    }

    const preparedData = Object.keys(value).reduce((acc, key) => {
      const propertyToUpdate = value[key];

      return propertyToUpdate === undefined ? acc : { ...acc, [key]: propertyToUpdate };
    }, {});

    try {
      const updatedBook = await this.db.updateRecord(id, preparedData);

      return updatedBook;
    } catch (error) {
      throw new Error(`The error occured while updating book with id: ${id}`);
    }
  }

  async deleteBook(id) {
    try {
      const result = await this.db.deleteRecord(id);

      return result;
    } catch (error) {
      throw new Error(`The error occured while deleting the book with id: ${id}`);
    }
  }
}

exports.BooksService = new BooksService(booksDb);
