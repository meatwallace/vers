const { sentryEsbuildPlugin } = require('@sentry/esbuild-plugin');

exports.sourcemap = true;

exports.plugins = [
  sentryEsbuildPlugin({
    authToken: process.env.SENTRY_AUTH_TOKEN,
    org: 'vers-idle',
    project: 'service-user',
    release: {
      name: process.env.COMMIT_SHA,
    },
  }),
];
