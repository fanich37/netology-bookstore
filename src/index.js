try {
  require('dotenv').config();
} catch (error) { }

const { APP_PORT = 3000 } = process.env;

const { app } = require('./app');

app.listen(APP_PORT, () => {
  console.log(`The server is running on port: ${APP_PORT}.`);
});
