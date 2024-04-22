import type { CodegenConfig } from '@graphql-codegen/cli';
import { printSchema } from 'graphql';
import { schema } from './projects/service-api/src/schema';

const config: CodegenConfig = {
  schema: printSchema(schema),
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
  // TODO: enable when introducing graphql-scalars
  // config: {
  //   scalars: {
  //     UUID: 'string',
  //     DateTime: 'Date',
  //   },
  // },
};

export default config;
