import { defineConfig } from 'vitest/config';

// stub file to prevent vitest workspaces from trying to execute our playwright tests
export default defineConfig({
  test: {
    environment: 'node',
    include: [],
    passWithNoTests: true,
    reporters: ['default'],
    watch: false,
  },
});
