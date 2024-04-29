import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  plugins: [nxViteTsPaths()],
  test: {
    globals: true,
    environment: 'node',
    passWithNoTests: true,
    env: loadEnv('test', process.cwd(), ''),
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.ts'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/apps/service-api',
      provider: 'v8',
    },
  },
});
