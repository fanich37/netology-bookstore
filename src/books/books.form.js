const textFields = [
  {
    name: 'title',
    type: 'text',
    label: 'Book title',
  },
  {
    name: 'description',
    type: 'text',
    label: 'Description',
  },
  {
    name: 'authors',
    type: 'text',
    label: 'Authors',
  },
  {
    name: 'favorite',
    type: 'text',
    label: 'Favorite',
  },
];

const fileFields = [
  {
    name: 'fileCover',
    label: 'File cover',
  },
  {
    name: 'fileBook',
    label: 'File book',
  },
];

const prepareFormErrors = (errors) => {
  if (!errors.details || errors.details.length === 0) {
    return null;
  }

  return errors.details.reduce((acc, { context, message }) => {
    const { key } = context;

    return { ...acc, [key]: message };
  }, {});
};

exports.textFields = textFields;
exports.fileFields = fileFields;
exports.prepareFormErrors = prepareFormErrors;
