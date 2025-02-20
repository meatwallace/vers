import { FlatCompat } from '@eslint/eslintrc';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import drizzlePlugin from 'eslint-plugin-drizzle';
import prettierConfig from 'eslint-config-prettier';
import unicornPlugin from 'eslint-plugin-unicorn';
import reactPlugin from 'eslint-plugin-react';
// import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  unicornPlugin.configs['flat/recommended'],
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  ...compat.extends('plugin:react-hooks/recommended'),
  // ...jsxA11yPlugin.flatConfigs.recommended,
  {
    settings: {
      react: {
        createClass: 'createReactClass',
        pragma: 'React',
        fragment: 'Fragment',
        version: 'detect',
      },
    },
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
      drizzle: drizzlePlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          ignoreRestSiblings: true,
        },
      ],

      'drizzle/enforce-delete-with-where': 'error',
      'drizzle/enforce-update-with-where': 'error',

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
