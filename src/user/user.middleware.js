const bodyParser = require('body-parser');

const urlEncodedParser = bodyParser.urlencoded({ extended: false });

exports.urlEncodedParser = urlEncodedParser;
