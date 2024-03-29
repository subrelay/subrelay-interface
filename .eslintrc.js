module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:vue/vue3-essential', 'airbnb-base'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['vue'],
  rules: {
    'no-param-reassign': [2, { props: false }],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'arrow-body-style': ['error', 'as-needed'],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'object-curly-newline': ['error', { ImportDeclaration: 'never' }],
    'vue/multi-word-component-names': 'off',
    'no-undef': 'off',
    'import/extensions': ['error', 'always', { js: 'never', vue: 'never', cjs: 'never' }],
    'max-len': ['error', { code: 200 }],
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', './src']],
        extensions: ['.js', '.vue'],
      },
    },
  },
};
