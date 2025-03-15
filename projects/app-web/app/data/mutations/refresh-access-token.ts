import { graphql } from '~/gql';

export const RefreshAccessTokenMutation = graphql(/* GraphQL */ `
  mutation RefreshAccessToken($input: RefreshAccessTokenInput!) {
    refreshAccessToken(input: $input) {
      ... on AuthPayload {
        accessToken
        refreshToken
        session {
          id
        }
      }

      ... on MutationErrorPayload {
        error {
          title
          message
        }
      }
    }
  }
`);
