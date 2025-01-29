import { MutationErrorPayload } from '~/gql/graphql';

export function isMutationError<T extends object>(
  payload: T | MutationErrorPayload,
): payload is MutationErrorPayload {
  return 'error' in payload;
}
