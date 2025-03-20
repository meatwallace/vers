import { TwoFactorLoginPayload } from '~/gql/graphql';

export function is2FARequiredPayload(
  payload: object | TwoFactorLoginPayload,
): payload is TwoFactorLoginPayload {
  return 'transactionID' in payload;
}
