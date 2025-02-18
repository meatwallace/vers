import { CreateWorld } from './create-world';
import { DeleteSession } from './delete-session';
import { DeleteWorld } from './delete-world';
import { FinishEmailSignup } from './finish-email-signup';
import { FinishPasswordReset } from './finish-password-reset';
import { GetCreatedWorld } from './get-created-world';
import { GetCurrentUser } from './get-current-user';
import { GetWorlds } from './get-worlds';
import { LoginWithPassword } from './login-with-password';
import { RefreshAccessToken } from './refresh-access-token';
import { StartEmailSignup } from './start-email-signup';
import { StartPasswordReset } from './start-password-reset';
import { VerifyOTP } from './verify-otp';

export const handlers = [
  // auth
  FinishEmailSignup,
  FinishPasswordReset,
  LoginWithPassword,
  RefreshAccessToken,
  StartEmailSignup,
  StartPasswordReset,
  VerifyOTP,

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
