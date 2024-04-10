import playwright from 'eslint-plugin-playwright';
import rootConfig from '../../eslint.config.js';

export default [
  playwright.configs['flat/recommended'],
  ...rootConfig,
  {
    files: ['src/**'],
  },
];
