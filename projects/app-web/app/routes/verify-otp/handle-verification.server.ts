import { VerificationType } from '~/gql/graphql.ts';
import { handle2FADisable } from './handle-2fa-disable.server.ts';
import { handle2FA } from './handle-2fa.server.ts';
import { handleChangeEmailConfirmation } from './handle-change-email-confirmation.server.ts';
import { handleChangeEmail } from './handle-change-email.server.ts';
import { handleChangePassword } from './handle-change-password.server.ts';
import { handleOnboarding } from './handle-onboarding.server.ts';
import { handleResetPassword } from './handle-reset-password.server.ts';
import { handleUnsupported } from './handle-unsupported.server.ts';
import { type HandleVerificationContext } from './types.ts';

export async function handleVerification(
  type: VerificationType,
  context: HandleVerificationContext,
) {
  const handleVerification = HANDLE_VERIFICATION_TYPE_STRATEGY[type];

  return handleVerification(context);
}

type VerificationHandlerStrategy = (
  ctx: HandleVerificationContext,
) => Promise<Response>;

type StrategyMap = Record<VerificationType, VerificationHandlerStrategy>;

const HANDLE_VERIFICATION_TYPE_STRATEGY: StrategyMap = {
  [VerificationType.ChangeEmail]: handleChangeEmail,
  [VerificationType.ChangeEmailConfirmation]: handleChangeEmailConfirmation,
  [VerificationType.ChangePassword]: handleChangePassword,
  [VerificationType.Onboarding]: handleOnboarding,
  [VerificationType.ResetPassword]: handleResetPassword,
  [VerificationType.TwoFactorAuth]: handle2FA,
  [VerificationType.TwoFactorAuthDisable]: handle2FADisable,
  [VerificationType.TwoFactorAuthSetup]: handleUnsupported,
};
