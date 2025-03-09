import { graphql } from '~/gql';

export const VerifyOTP = graphql(/* GraphQL */ `
  mutation VerifyOTP($input: VerifyOTPInput!) {
    verifyOTP(input: $input) {
      ... on TwoFactorSuccessPayload {
        transactionToken
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
