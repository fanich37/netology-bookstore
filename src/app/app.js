const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

app.use(helmet());
app.use(cors());
app.use('/public', express.static(path.join(__dirname, '..', 'public')));

exports.app = app;
