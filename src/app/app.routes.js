const { app } = require('./app');

const { UserController } = require('../user');
const { BooksController } = require('../books');

app.use('/user', UserController);
app.use('/books', BooksController);
app.use('*', (_, res) => res.sendStatus(404));

exports.app = app;
