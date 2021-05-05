module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow paren-less arrow functions
    'no-useless-escape': 'off',
    'arrow-parens': 'off',
    'one-var': 'off',
    'no-unused-vars': 'off',
    'semi': 'off',
    'camelcase': 'off',
    'no-async-promise-executor': 'off',
    'prefer-const': 'off',
    'object-property-newline': 'off',
    'no-extend-native': 'off',
    'import/first': 'off',
    'import/named': 'error',
    'import/namespace': 'error',
    'import/default': 'error',
    'import/export': 'error',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
    'prefer-promise-reject-errors': 'off',
    'space-before-function-paren': 'off',
    'no-unneeded-ternary': 'off',
    'dot-notation': 'off',
    // allow console.log during development only
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // allow debugger during development only
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
