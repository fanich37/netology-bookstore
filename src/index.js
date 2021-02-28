try {
  require('dotenv').config();
  // eslint-disable-next-line no-empty
} catch (error) { }

const { PORT = 3000 } = process.env;

const { app } = require('./app');

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`The server is running on port: ${PORT}.`);
});
