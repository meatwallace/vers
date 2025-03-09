import { MutationErrorPayload } from '../types/mutation-error-payload';
import { TwoFactorRequiredPayload } from '../types/two-factor-required-payload';

export function createPayloadResolver<T>(
  type: T,
): (
  value: object,
) => T | typeof MutationErrorPayload | typeof TwoFactorRequiredPayload {
  return (value) => {
    if ('error' in value) {
      return MutationErrorPayload;
    }

    if ('transactionID' in value) {
      return TwoFactorRequiredPayload;
    }

    return type;
  };
}
