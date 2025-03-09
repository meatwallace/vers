import { TwoFactorRequiredPayload } from '~/gql/graphql';

export function is2FARequiredPayload(
  payload: object | TwoFactorRequiredPayload,
): payload is TwoFactorRequiredPayload {
  return 'transactionID' in payload;
}
