import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { searchForWorkspaceRoot } from 'vite';
import { defineConfig, loadEnv } from 'vite';
import { vitePlugin as remix } from '@remix-run/dev';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  root: __dirname,
  server: {
    ws: process.env.VITEST === 'true' ? false : undefined,
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
    !process.env.VITEST &&
      remix({
        ignoredRouteFiles: ['**/*'],
        future: {
          unstable_optimizeDeps: true,
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true,
          v3_lazyRouteDiscovery: true,
          v3_singleFetch: true,
          v3_routeConfig: true,
        },
      }),
    vanillaExtractPlugin(),
    nxViteTsPaths(),
  ],

  // @ts-expect-error - we're not using vitest's `defineConfig` as it has errors with our plugin type definitions
  test: {
    watch: false,
    setupFiles: ['vitest.setup.ts'],
    globals: true,
    environment: 'happy-dom',
    passWithNoTests: true,
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
