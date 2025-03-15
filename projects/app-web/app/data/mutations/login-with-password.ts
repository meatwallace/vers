import { graphql } from '~/gql';

export const LoginWithPasswordMutation = graphql(/* GraphQL */ `
  mutation LoginWithPassword($input: LoginWithPasswordInput!) {
    loginWithPassword(input: $input) {
      ... on AuthPayload {
        accessToken
        refreshToken
        session {
          id
          expiresAt
        }
      }

      ... on TwoFactorRequiredPayload {
        transactionID
        sessionID
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
