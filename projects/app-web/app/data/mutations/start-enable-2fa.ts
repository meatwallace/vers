import { graphql } from '~/gql';

export const StartEnable2FAMutation = graphql(/* GraphQL */ `
  mutation StartEnable2FA($input: StartEnable2FAInput!) {
    startEnable2FA(input: $input) {
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
