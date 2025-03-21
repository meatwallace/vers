export enum Routes {
  Contact = '/contact',
  Dashboard = '/dashboard',
  ForgotPassword = '/forgot-password',
  Index = '/',
  Login = '/login',
  LoginForceLogout = '/login/force-logout',
  Logout = '/logout',
  Onboarding = '/onboarding',
  Profile = '/profile',
  ProfileChangeEmail = '/profile/change-email',
  ProfileChangePassword = '/profile/change-password',
  ProfileVerify2FA = '/profile/2fa/verify',
  ResetPassword = '/reset-password',
  ResetPasswordStarted = '/reset-password-started',
  Signup = '/signup',
  VerifyOTP = '/verify-otp',
}

type TimingMetric =
  | { description?: string; start: number; time?: never }
  | { description?: string; start?: never; time: number };

export type Timings = Record<string, Array<TimingMetric>>;

export interface GenericGQLPayload {
  __typename: string;
  [key: string]: unknown;
}
