export default {
  'projects/{app-web,service-api}/**/*.{ts,tsx}': () => `yarn codegen:graphql`,
  'projects/**/*.{ts,tsx}': (files) => [
    `yarn nx affected --target=typecheck --files=${files.join(',')}`,
    `yarn nx affected --target=test`,
  ],
  'projects/**/*.{js,ts,jsx,tsx,json}': [
    (files) => `yarn nx affected:lint --files=${files.join(',')}`,
    (files) => `yarn nx format:write --files=${files.join(',')}`,
  ],
};
