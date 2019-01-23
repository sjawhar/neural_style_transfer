module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
  },
  env: {
    node: true,
    browser: true,
  },
  extends: ['plugin:vue/recommended', '@vue/prettier'],
  rules: {
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/html-closing-bracket-newline': ['error', {
        'singleline': 'never',
        'multiline': 'always'
    }],
  },
};
