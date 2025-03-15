import { graphql } from '~/gql';

export const StartPasswordResetMutation = graphql(/* GraphQL */ `
  mutation StartPasswordReset($input: StartPasswordResetInput!) {
    startPasswordReset(input: $input) {
      ... on MutationSuccess {
        success
      }

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
