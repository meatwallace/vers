// import nxReactConfig from '@nx/react';
import rootConfig from '../../eslint.config.js';

export default [
  // nxReactConfig,
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
    ],
  },
];
