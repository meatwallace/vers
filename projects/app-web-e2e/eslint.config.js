import playwright from 'eslint-plugin-playwright';
import rootConfig from '../../eslint.config.js';

export default [
  playwright.configs['flat/playwright'],
  rootConfig,
  {
    ignores: ['!**/*'],
    overrides: [
      {
        files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
        rules: {},
      },
      {
        files: ['*.ts', '*.tsx'],
        rules: {},
      },
      {
        files: ['*.js', '*.jsx'],
        rules: {},
      },
      {
        files: ['src/**/*.{ts,js,tsx,jsx}'],
        rules: {},
      },
    ],
  },
];
