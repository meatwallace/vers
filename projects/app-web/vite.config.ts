import { reactRouter } from '@react-router/dev/vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { searchForWorkspaceRoot } from 'vite';
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    !process.env.VITEST && reactRouter(),
    vanillaExtractPlugin(),
    tsconfigPaths(),
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

  // @ts-expect-error - we're not using vitest's `defineConfig` as it has errors with our plugin type definitions
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
