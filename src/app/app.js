const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

const helmetContentSecurityPolicy = helmet.contentSecurityPolicy.getDefaultDirectives();
const { 'upgrade-insecure-requests': _, ...rest } = helmetContentSecurityPolicy;

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...rest,
    },
  },
}));
app.use(cors());
app.use('/public', express.static(path.join(__dirname, '..', 'public')));
app.set('views', [
  path.join(__dirname, '..', 'templates'),
  path.join(__dirname, '..', 'books', 'templates'),
]);
app.set('view engine', 'ejs');

exports.app = app;
