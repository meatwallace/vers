import { reactRouterHonoServer } from 'react-router-hono-server/dev';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pandacss from '@pandacss/dev/postcss';
import { reactRouter } from '@react-router/dev/vite';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import autoprefixer from 'autoprefixer';
import { searchForWorkspaceRoot } from 'vite';
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  build: {
    sourcemap: true,
  },
  css: {
    postcss: {
      // @ts-expect-error - pandacss types are bogus
      plugins: [pandacss, autoprefixer],
    },
  },
  plugins: [
    reactRouterHonoServer({ serverEntryPoint: './server/index.ts' }),
    !process.env.VITEST && reactRouter(),
    tsconfigPaths(),
    process.env.SENTRY_AUTH_TOKEN
      ? sentryVitePlugin({
          authToken: process.env.SENTRY_AUTH_TOKEN,
          disable: process.env.NODE_ENV !== 'production',
          org: 'vers-idle',
          project: 'app-web',
          release: {
            name: process.env.COMMIT_SHA,
            setCommits: {
              auto: true,
            },
          },
          sourcemaps: {
            filesToDeleteAfterUpload: [
              './build/**/*.map',
              '.server-build/**/*.map',
            ],
          },
        })
      : null,
  ],
  preview: {
    host: 'localhost',
    port: 4300,
  },
  root: __dirname,
  server: {
    fs: {
      allow: [
        // vite's default workspace root detection behaviour
        searchForWorkspaceRoot(process.cwd()),

        // explicitly allow serving our pnp'd virtual modules
        '../../.yarn',
      ],
    },
    host: 'localhost',
    port: 4000,
    ws: process.env.VITEST === 'true' ? false : undefined,
  },
  test: {
    coverage: {
      provider: 'v8',
      reportsDirectory: '../../coverage/apps/app-web',
    },
    env: {
      ...loadEnv('test', __dirname, ''),

      // set secret env vars here so we don't need to load a `.local` env file in tests
      SESSION_SECRET: 'secret',
    },
    environment: 'happy-dom',
    include: ['app/**/*.test.{ts,tsx}'],
    passWithNoTests: true,
    reporters: ['default'],
    setupFiles: ['vitest.setup.ts'],
    watch: false,
  },
});
