const { app } = require('./app');

const { UserController } = require('../user');
const { BooksApiController } = require('../books');
const { BooksViewController } = require('../books');

app.use('/user', UserController);
app.use('/api/books', BooksApiController);
app.use('/', BooksViewController);
app.use('*', (_, res) => res.sendStatus(404));

exports.app = app;
