import rootConfig from '../../eslint.config.cjs';

export default [
  ...rootConfig,
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {},
  },
];
