import { CreateWorld } from './create-world';
import { DeleteSession } from './delete-session';
import { DeleteWorld } from './delete-world';
import { FinishDisable2FA } from './finish-disable-2fa';
import { FinishEmailSignup } from './finish-email-signup';
import { FinishEnable2FA } from './finish-enable-2fa';
import { FinishLoginWith2FA } from './finish-login-with-2fa';
import { FinishPasswordReset } from './finish-password-reset';
import { GetCreatedWorld } from './get-created-world';
import { GetCurrentUser } from './get-current-user';
import { GetEnable2FAVerification } from './get-enable-2fa-verification';
import { GetWorlds } from './get-worlds';
import { LoginWithPassword } from './login-with-password';
import { RefreshAccessToken } from './refresh-access-token';
import { StartDisable2FA } from './start-disable-2fa';
import { StartEmailSignup } from './start-email-signup';
import { StartEnable2FA } from './start-enable-2fa';
import { StartPasswordReset } from './start-password-reset';
import { VerifyOTP } from './verify-otp';

export const handlers = [
  // auth
  FinishEmailSignup,
  FinishLoginWith2FA,
  FinishPasswordReset,
  LoginWithPassword,
  RefreshAccessToken,
  StartEmailSignup,
  StartPasswordReset,
  VerifyOTP,

  // 2fa management
  FinishDisable2FA,
  FinishEnable2FA,
  GetEnable2FAVerification,
  StartDisable2FA,
  StartEnable2FA,

  // sessions
  DeleteSession,
  GetWorlds,

  // users
  GetCurrentUser,

  // worlds
  CreateWorld,
  DeleteWorld,
  GetCreatedWorld,
];
