import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    // @ts-expect-error - outdated plugin types
    tsconfigPaths(),
  ],
  server: {
    ws: process.env.VITEST === 'true' ? false : undefined,
  },
  test: {
    coverage: {
      provider: 'v8',
      reportsDirectory: '../../coverage/apps/lib-service-test-utils',
    },
    environment: 'node',
    globals: true,
    globalSetup: './vitest.global-setup.ts',
    include: ['src/**/*.test.ts'],
    passWithNoTests: true,
    reporters: ['default'],
    setupFiles: ['./vitest.setup.ts'],
    testTimeout: 30 * 1000,
    watch: false,
  },
});
