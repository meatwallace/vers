import { MutationErrorPayload } from '../types/mutation-error-payload';

export function createPayloadResolver<T>(
  type: T,
): (value: object) => T | typeof MutationErrorPayload {
  return (value) => {
    if ('error' in value) {
      return MutationErrorPayload;
    }

    return type;
  };
}
