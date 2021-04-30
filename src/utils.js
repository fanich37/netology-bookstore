const fetch = require('node-fetch');

exports.fetchData = async (url, options) => {
  const response = await fetch(url, options);
  const json = await response.json();

  return json;
};

exports.prepareFormErrors = (errors) => {
  if (!errors.details || errors.details.length === 0) {
    return null;
  }

  return errors.details.reduce((acc, { context, message }) => {
    const { key } = context;

    return { ...acc, [key]: message };
  }, {});
};
