import { defineConfig } from '@pandacss/dev';
import { preset } from '@vers/panda-preset';

export default defineConfig({
  exclude: [],
  include: ['../lib-design-system/src/**/*.tsx', './app/**/*.{ts,tsx}'],
  jsxFramework: 'react',
  outdir: 'app/styled-system',
  preflight: true,
  presets: [preset],
});
