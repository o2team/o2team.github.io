module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recess-order',
    'stylelint-config-prettier',
  ],
  plugins: ['stylelint-scss', 'stylelint-order'],
  rules: {
    'selector-pseudo-class-no-unknown': null,
    'at-rule-no-unknown': null,
    'no-empty-source': null,
    'scss/at-rule-no-unknown': true,
    'no-descending-specificity': null,
    'selector-list-comma-newline-after': null,
    'declaration-empty-line-before': null,
  },
};
