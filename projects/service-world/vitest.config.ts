import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  plugins: [nxViteTsPaths()],
  server: {
    // @ts-expect-error - `ws` is a new option and isn't typed yet in vitest
    ws: process.env.VITEST === 'true' ? false : undefined,
  },
  test: {
    watch: false,
    globals: true,
    environment: 'node',
    passWithNoTests: true,
    env: loadEnv('test', process.cwd(), ''),
    setupFiles: ['./vitest.setup.ts'],
    globalSetup: ['./vitest.global-setup.ts'],
    testTimeout: 30 * 1000,
    include: ['src/**/*.test.ts'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/apps/service-world',
      provider: 'v8',
    },
  },
});
