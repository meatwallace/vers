import { defineConfig } from '@pandacss/dev';
import { preset } from '@vers/panda-preset';

export default defineConfig({
  exclude: [],
  include: [
    '../lib-aether-client/src/**/*.{ts,tsx}',
    '../lib-design-system/src/**/*.{ts,tsx}',
    '../lib-idle-client/src/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  jsxFramework: 'react',
  outdir: 'app/styled-system',
  preflight: true,
  presets: [preset],
  shorthands: false,
});
