// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const lint = require("lenix/lint")

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      ...lint.strict
    }
  },
]);
