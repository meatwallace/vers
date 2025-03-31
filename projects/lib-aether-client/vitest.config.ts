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
      reportsDirectory: '../../coverage/apps/lib-aether-client',
    },
    environment: 'happy-dom',
    include: ['src/**/*.test.{ts,tsx}'],
    passWithNoTests: true,
    reporters: ['default'],
    setupFiles: ['@vitest/web-worker', './vitest.setup.ts'],
    testTimeout: 30 * 1000,
    watch: false,
  },
});
