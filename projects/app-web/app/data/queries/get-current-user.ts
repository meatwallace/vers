import { graphql } from '~/gql';

export const GetCurrentUser = graphql(/* GraphQL */ `
  query GetCurrentUser {
    getCurrentUser {
      id
      username
      name
      email
      is2FAEnabled
    }
  }
`);
