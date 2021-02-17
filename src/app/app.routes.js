const { app } = require('./app');

const { UserController } = require('../user');
const { BooksController } = require('../books');

app.use('/api/user', UserController);
app.use('/api/books', BooksController);
app.use('*', (_, res) => res.sendStatus(404));

exports.app = app;
