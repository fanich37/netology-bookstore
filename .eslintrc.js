module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es2021': true,
  },
  'parser': 'babel-eslint',
  'globals': {
    'process': 'readonly',
    '__dirname': 'readonly',
    'Buffer': 'readonly',
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'ecmaVersion': 12,
  },
  'rules': {
    'indent': [
      'error',
      2,
    ],
    'linebreak-style': [
      'error',
      'unix',
    ],
    'quotes': [
      'error',
      'single',
    ],
    'semi': [
      'error',
      'always',
    ],
    'no-multi-spaces': 'error',
    'comma-dangle': ['error', {
      'arrays': 'always-multiline',
      'objects': 'always-multiline',
      'imports': 'always-multiline',
      'exports': 'always-multiline',
      'functions': 'always-multiline',
    }],
    'no-unused-vars': ['error', { 'varsIgnorePattern': '^_$' }],
  },
};
