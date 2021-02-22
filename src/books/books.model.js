const uuid = require('uuid').v4;

class Book {
  constructor({ title, description = '', authors, favorite = '', fileCover, fileName, fileBook }) {
    this.id = uuid();
    this.title = title;
    this.description = description;
    this.authors = authors;
    this.favorite = favorite;
    this.fileCover = fileCover;
    this.fileName = fileName;
    this.fileBook = fileBook;
  }
}

exports.Book = Book;
