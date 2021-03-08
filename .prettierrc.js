module.exports = {
  arrowParens: 'always',
  bracketSpacing: true,
  endOfLine: 'lf',
  jsxBracketSameLine: false,
  jsxSingleQuote: false,
  parser: 'babel-ts',
  printWidth: 100,
  quoteProps: 'as-needed',
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: false,
  overrides: [
    {
      files: ['*.scss', '*.css'],
      options: {
        parser: 'css',
      },
    },
  ],
};
