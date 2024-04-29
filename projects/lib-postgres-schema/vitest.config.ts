import { defineConfig } from 'vitest/config';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  plugins: [nxViteTsPaths()],
  test: {
    globals: true,
    environment: 'node',
    passWithNoTests: true,
    setupFiles: ['./vitest.setup.ts'],
    testTimeout: 30 * 1000,
    include: ['src/**/*.test.ts'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/apps/lib-postgres-schema',
      provider: 'v8',
    },
  },
});
