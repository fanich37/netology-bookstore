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

exports.textFields = textFields;
exports.fileFields = fileFields;
