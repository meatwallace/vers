/* eslint-disable no-undef, @typescript-eslint/no-var-requires */
// TODO(#12): revert to module syntax when pnp supports eslint 9
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const prettierConfig = require('eslint-config-prettier');
const unicornPlugin = require('eslint-plugin-unicorn');

module.exports = tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  unicornPlugin.configs['flat/recommended'],
  {
    languageOptions: {
      globals: {
        console: 'readonly',
      },
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },
    plugins: {
      //
    },
    rules: {
      'unicorn/no-null': 'off',
      'unicorn/prevent-abbreviations': 'off',
    },
  },
  {
    ignores: [
      '**/.nx/**',
      '**/.yarn/**',
      '**/build/**',
      '**/dist/**',
      '.pnp.cjs',
      '.pnp.loader.mjs',
      '**/*timestamp*.mjs',
      '**/mockServiceWorker.js',
      '**/projects/app-web/app/gql/**',
    ],
  },
);
