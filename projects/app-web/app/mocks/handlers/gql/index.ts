import { ChangeUserPassword } from './change-user-password';
import { DeleteSession } from './delete-session';
import { FinishChangeUserEmail } from './finish-change-user-email';
import { FinishDisable2FA } from './finish-disable-2fa';
import { FinishEmailSignup } from './finish-email-signup';
import { FinishEnable2FA } from './finish-enable-2fa';
import { FinishLoginWith2FA } from './finish-login-with-2fa';
import { FinishPasswordReset } from './finish-password-reset';
import { GetCurrentUser } from './get-current-user';
import { GetEnable2FAVerification } from './get-enable-2fa-verification';
import { LoginWithForcedLogout } from './login-with-forced-logout';
import { LoginWithPassword } from './login-with-password';
import { RefreshAccessToken } from './refresh-access-token';
import { StartChangeUserEmail } from './start-change-user-email';
import { StartEmailSignup } from './start-email-signup';
import { StartEnable2FA } from './start-enable-2fa';
import { StartPasswordReset } from './start-password-reset';
import { StartStepUpAuth } from './start-step-up-auth';
import { VerifyOTP } from './verify-otp';

export const handlers = [
  // auth
  FinishEmailSignup,
  FinishLoginWith2FA,
  FinishPasswordReset,
  LoginWithForcedLogout,
  LoginWithPassword,
  RefreshAccessToken,
  StartEmailSignup,
  StartPasswordReset,
  StartStepUpAuth,
  VerifyOTP,

  // 2FA management
  FinishDisable2FA,
  FinishEnable2FA,
  GetEnable2FAVerification,
  StartEnable2FA,

  // sessions
  DeleteSession,

  // users
  ChangeUserPassword,
  FinishChangeUserEmail,
  GetCurrentUser,
  StartChangeUserEmail,
];
