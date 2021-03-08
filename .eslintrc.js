module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/react',
    'prettier/@typescript-eslint',
  ],

  settings: {
    react: {
      pragma: 'React',
      version: 'detect',
    },
  },

  env: {
    browser: true,
    es6: true,
  },

  rules: {
    'comma-dangle': [2, 'always-multiline'],
    'semi': [2, 'always'],
    '@typescript-eslint/no-empty-interface': [0],
    'react/prop-types': [0],
  },
};
