export enum Routes {
  // public
  Contact = '/contact',
  Index = '/',

  // auth
  ForgotPassword = '/forgot-password',
  Login = '/login',
  LoginForceLogout = '/login/force-logout',
  Logout = '/logout',
  Onboarding = '/onboarding',
  ResetPassword = '/reset-password',
  ResetPasswordStarted = '/reset-password-started',
  Signup = '/signup',
  VerifyOTP = '/verify-otp',

  // account management
  Account = '/account',
  AccountChangeEmail = '/account/change-email',
  AccountChangePassword = '/account/change-password',
  AccountVerify2FA = '/account/2fa/verify',

  // game
  Aether = '/aether',
  Arena = '/arena',
  Character = '/character',
  Forge = '/forge',
  Nexus = '/nexus',
  Stash = '/stash',

  // community
  Guilds = '/guilds',
  Leaderboards = '/leaderboards',
  Market = '/market',
  Wiki = '/wiki',
}

type TimingMetric =
  | { description?: string; start: number; time?: never }
  | { description?: string; start?: never; time: number };

export type Timings = Record<string, Array<TimingMetric>>;

export interface GenericGQLPayload {
  __typename: string;
  [key: string]: unknown;
}
