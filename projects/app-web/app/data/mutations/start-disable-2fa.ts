import { graphql } from '~/gql';

export const StartDisable2FAMutation = graphql(/* GraphQL */ `
  mutation StartDisable2FA($input: StartDisable2FAInput!) {
    startDisable2FA(input: $input) {
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
