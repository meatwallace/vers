import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import unicornPlugin from 'eslint-plugin-unicorn';

export default tseslint.config(
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
    ignores: ['**/dist/**', '**/*timestamp*.mjs'],
  },
);
