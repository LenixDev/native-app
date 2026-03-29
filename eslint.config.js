// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config')
const expoConfig = require('eslint-config-expo/flat')
const lint = require('lenix/lint')
const prettier = require('eslint-config-prettier')

module.exports = defineConfig([
  expoConfig,
  {
    extends: [prettier],
    ignores: ['dist/*'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      ...lint.strict,
      'react/no-unescaped-entities': 'off',
      'id-length': ['error', { exceptions: ['_', 't'] }],
    },
  },
])
