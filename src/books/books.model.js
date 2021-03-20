const uuid = require('uuid').v4;

class Book {
  constructor({ title, description = '', authors, favorite = '', fileCover, fileName, fileBook }) {
    this._id = uuid();
    this.title = title;
    this.description = description;
    this.authors = authors;
    this.favorite = favorite;
    this.fileCover = fileCover;
    this.fileName = fileName;
    this.fileBook = fileBook;
  }
}

const BookSchema = {
  _id: String,
  title: String,
  description: String,
  authors: String,
  favorite: String,
  fileCover: String,
  fileName: String,
  fileBook: String,
};

exports.Book = Book;
exports.BookSchema = BookSchema;