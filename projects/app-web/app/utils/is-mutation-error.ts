import { MutationErrorPayload } from '~/gql/graphql';

export function isMutationError(
  payload: MutationErrorPayload | object,
): payload is MutationErrorPayload {
  return 'error' in payload;
}
