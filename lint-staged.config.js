export default {
  '{projects}/**/*.{ts,tsx}': (files) =>
    `yarn nx affected --target=typecheck --files=${files.join(',')}`,
  '{projects}/**/*.{js,ts,jsx,tsx,json}': [
    (files) => `yarn nx affected:lint --files=${files.join(',')}`,
    (files) => `yarn nx format:write --files=${files.join(',')}`,
  ],
};
