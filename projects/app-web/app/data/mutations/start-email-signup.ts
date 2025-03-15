import { graphql } from '~/gql';

export const StartEmailSignupMutation = graphql(/* GraphQL */ `
  mutation StartEmailSignup($input: StartEmailSignupInput!) {
    startEmailSignup(input: $input) {
      ... on TwoFactorRequiredPayload {
        transactionID
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
