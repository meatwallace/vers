export default {
  'projects/{app-web,service-api}/**/*.{ts,tsx}': () => [
    `yarn codegen:graphql`,
    'git add .',
  ],
  'projects/**/*.{ts,tsx}': [
    (files) => `yarn nx affected --target=typecheck --files=${files.join(',')}`,
    `yarn nx affected --target=test`,
  ],
  'projects/**/*.{js,ts,jsx,tsx,json}': (files) => [
    `yarn lint --files ${files.join(',')}`,
    `yarn format --files ${files.join(',')}`,
    'git add .',
  ],
  'projects/lib-postgres-schema/**/*.ts': () => [
    'yarn postgres:migrations-generate',
    'git add .',
  ],
  '**/*.graphql': () => ['yarn format', 'git add .'],
};
