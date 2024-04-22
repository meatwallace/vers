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
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },
    plugins: {
      //
    },
    rules: {
      'unicorn/prevent-abbreviations': [
        'error',
        {
          allowList: {
            args: true,
            Args: true,
            ctx: true,
            env: true,
            Env: true,
          },
        },
      ],
      //
    },
  },
  {
    ignores: ['**/dist/**', '**/build/**', '**/*timestamp*.mjs'],
  },
);
