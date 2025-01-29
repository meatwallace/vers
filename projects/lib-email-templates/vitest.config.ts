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
    watch: false,
    globals: true,
    environment: 'happy-dom',
    passWithNoTests: true,
    setupFiles: ['./vitest.setup.ts'],
    testTimeout: 30 * 1000,
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/apps/lib-email-templates',
      provider: 'v8',
    },
  },
});
