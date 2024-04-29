import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { searchForWorkspaceRoot } from 'vite';
import { defineConfig, loadEnv } from 'vite';
import { vitePlugin as remix } from '@remix-run/dev';
import { installGlobals } from '@remix-run/node';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { flatRoutes } from 'remix-flat-routes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

installGlobals();

export default defineConfig({
  root: __dirname,
  server: {
    port: 4000,
    host: 'localhost',
    fs: {
      allow: [
        // vite's default workspace root detection behaviour
        searchForWorkspaceRoot(process.cwd()),

        // explicitly allow serving our pnp'd virtual modules
        '../../.yarn',
      ],
    },
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  plugins: [
    react(),
    !process.env.VITEST &&
      remix({
        ignoredRouteFiles: ['**/*'],
        routes: async (defineRoutes) => {
          return flatRoutes('routes', defineRoutes, {
            // because `nx` builds our project graph from the workspace root, we need to
            // adjust the appDir to the correct location of the app-web folder for that case
            appDir:
              process.cwd() === __dirname ? 'app' : 'projects/app-web/app',
            ignoredRouteFiles: [
              '.*',
              '**/*.css',
              '**/*.test.{ts,tsx}',
              '**/__*.*',
              // this allows server files to be colocated with routes. use escape brackets to user 'server' or 'client'
              // in the filename ex. my-route.[server].tsx
              '**/*.server.*',
              '**/*.client.*',
            ],
          });
        },
      }),
    vanillaExtractPlugin(),
    nxViteTsPaths(),
  ],

  // @ts-expect-error - we're not using vitest's `defineConfig` as it has errors with our plugin type definitions
  test: {
    setupFiles: ['vitest.setup.ts'],
    globals: true,
    environment: 'happy-dom',
    env: {
      ...loadEnv('test', process.cwd(), ''),

      // set secret env vars here so we don't need to load a `.local` env file in tests
      SESSION_SECRET: 'secret',
      AUTH0_CLIENT_SECRET: 'secret',
    },
    include: ['app/**/*.test.{ts,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/apps/app-web',
      provider: 'v8',
    },
  },
});
