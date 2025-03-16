import { graphql } from '~/gql';

export const StartChangeUserPasswordMutation = graphql(/* GraphQL */ `
  mutation StartChangeUserPassword($input: StartChangeUserPasswordInput!) {
    startChangeUserPassword(input: $input) {
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
