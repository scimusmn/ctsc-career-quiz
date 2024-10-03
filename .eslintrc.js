const path = require('path');

module.exports = {
  extends: ['airbnb', 'plugin:jsx-a11y/strict', 'plugin:prettier/recommended'],
  env: {
    browser: true,
  },
  parserOptions: {
    ecmaVersion: 2020, // or higher, like 2021, 2022, etc., to support optional chaining and other modern syntax
    sourceType: 'module', // If you are using ECMAScript modules
  },
  ignorePatterns: ['public/*', 'src/Arduino/arduino-base', 'src/html.js'],
  rules: {
    'import/no-extraneous-dependencies': 'off',
    // The SMM team doesn't write React code in .jsx files exclusively, as is suggested in the
    // Airbnb guide, so override this rule to allow .js files.
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.js', '.jsx'],
      },
    ],
    'react/forbid-prop-types': 'off',
    'react/no-danger': 'off',
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@components', path.resolve(__dirname, './src/components')],
          ['@styles', path.resolve(__dirname, './src/styles')],
        ],
        extensions: ['.ts', '.js', '.jsx', '.json'],
      },
    },
  },
};
