try {
  require('dotenv').config();
  // eslint-disable-next-line no-empty
} catch (error) { }

const mongoose = require('mongoose');
const {
  PORT = 3000,
  MONGO_DB_USER,
  MONGO_DB_PASSWORD,
  MONGO_DB_CONNECTION,
  MONGO_DB_NAME,
} = process.env;

const { app } = require('./app');

(async () => {
  try {
    await mongoose.connect(MONGO_DB_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      user: MONGO_DB_USER,
      pass: MONGO_DB_PASSWORD,
      dbName: MONGO_DB_NAME,
    });

    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`The server is running on port: ${PORT}.`);
    });
  } catch (error) {
    throw new Error('The error occured while initializing the app...');
  }
})();
