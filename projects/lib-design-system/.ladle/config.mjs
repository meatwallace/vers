/** @type {import('@ladle/react').UserConfig} */
export default {
  addons: {
    theme: {
      default: 'dark',
      enabled: true,
    },
  },
  viteConfig: process.cwd() + '/vitest.config.ts',
};
