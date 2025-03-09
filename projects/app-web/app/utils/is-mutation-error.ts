import { MutationErrorPayload } from '~/gql/graphql';

export function isMutationError(
  payload: object | MutationErrorPayload,
): payload is MutationErrorPayload {
  return 'error' in payload;
}
