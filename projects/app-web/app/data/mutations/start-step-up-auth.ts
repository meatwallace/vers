import { graphql } from '~/gql';

export const StartStepUpAuthMutation = graphql(/* GraphQL */ `
  mutation StartStepUpAuth($input: StartStepUpAuthInput!) {
    startStepUpAuth(input: $input) {
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
