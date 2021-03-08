const fetch = require('node-fetch');

exports.fetchData = async (url, options) => {
  const response = await fetch(url, options);
  const json = await response.json();

  return json;
};
