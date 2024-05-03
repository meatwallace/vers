import drizzlePlugin from 'eslint-plugin-drizzle';
import rootConfig from '../../eslint.config.cjs';

export default [
  ...rootConfig,
  {
    plugins: {
      drizzle: drizzlePlugin,
    },
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'drizzle/enforce-delete-with-where': 'error',
      'drizzle/enforce-update-with-where': 'error',
    },
  },
];
