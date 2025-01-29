import { CreateWorld } from './create-world';
import { DeleteWorld } from './delete-world';
import { DeleteSession } from './delete-session';
import { FinishEmailSignup } from './finish-email-signup';
import { GetCurrentUser } from './get-current-user';
import { GetCreatedWorld } from './get-created-world';
import { GetWorlds } from './get-worlds';
import { LoginWithPassword } from './login-with-password';
import { RefreshAccessToken } from './refresh-access-token';
import { StartEmailSignup } from './start-email-signup';
import { VerifyOTP } from './verify-otp';

export const handlers = [
  CreateWorld,
  DeleteSession,
  DeleteWorld,
  FinishEmailSignup,
  GetCreatedWorld,
  GetCurrentUser,
  GetWorlds,
  LoginWithPassword,
  RefreshAccessToken,
  StartEmailSignup,
  VerifyOTP,
];
