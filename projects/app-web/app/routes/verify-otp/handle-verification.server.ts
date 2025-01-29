import { VerificationType } from '~/gql/graphql.ts';
import { type HandleVerificationContext } from './types.ts';
import { handleOnboarding } from './handle-onboarding.server.ts';
import { handleResetPassword } from './handle-reset-password.server.ts';
import { handleChangeEmail } from './handle-change-email.server.ts';
import { handle2FA } from './handle-2fa.server.ts';

export async function handleVerification(
  type: VerificationType,
  context: HandleVerificationContext,
) {
  const handleVerification = HANDLE_VERIFICATION_TYPE_STRATEGY[type];

  return handleVerification(context);
}

const HANDLE_VERIFICATION_TYPE_STRATEGY = {
  [VerificationType.Onboarding]: handleOnboarding,
  [VerificationType.ResetPassword]: handleResetPassword,
  [VerificationType.ChangeEmail]: handleChangeEmail,
  [VerificationType.TwoFactorAuth]: handle2FA,
};
