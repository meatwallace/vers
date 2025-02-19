import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tsconfigPaths from 'vite-tsconfig-paths';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    // @ts-expect-error - outdated plugin types
    tsconfigPaths(),
  ],
  server: {
    ws: process.env.VITEST === 'true' ? false : undefined,
  },
  test: {
    watch: false,
    globals: true,
    environment: 'node',
    passWithNoTests: true,
    env: loadEnv('test', __dirname, ''),
    setupFiles: ['./vitest.setup.ts'],
    testTimeout: 30 * 1000,
    include: ['src/**/*.test.ts'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/apps/service-user',
      provider: 'v8',
    },
  },
});
