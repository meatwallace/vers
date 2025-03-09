import { GraphQLClient } from 'graphql-request';

export function createGQLClient() {
  const client = new GraphQLClient(import.meta.env.VITE_API_URL);

  return client;
}
