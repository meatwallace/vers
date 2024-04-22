import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { searchForWorkspaceRoot } from 'vite';
import { defineConfig } from 'vite';
import { vitePlugin as remix } from '@remix-run/dev';
import { installGlobals } from '@remix-run/node';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

installGlobals();

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/app-web',
  server: {
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

  plugins: [react(), !process.env.VITEST && remix(), nxViteTsPaths()],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  build: {
    outDir: './dist/app-web',
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },

  // @ts-expect-error - we're not using vitest's `defineConfig` as it has errors with our plugin type definitions
  test: {
    setupFiles: ['test-setup.ts'],
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/apps/app-web',
      provider: 'v8',
    },
  },
});
