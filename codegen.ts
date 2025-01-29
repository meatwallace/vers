import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './projects/service-api/src/schema/**/*.ts',
  require: ['tsx/cjs'],
  documents: ['projects/app-web/app/**/*.ts?(x)'],
  generates: {
    './projects/app-web/app/gql/': {
      preset: 'client',
      plugins: [],
    },
    'schema.graphql': {
      plugins: ['schema-ast'],
    },
  },
  config: {
    scalars: {
      Date: {
        input: 'Date',
        output: 'string',
      },
      DateTime: {
        input: 'Date',
        output: 'string',
      },
    },
  },
};

export default config;
