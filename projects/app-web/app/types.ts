export enum Routes {
  Dashboard = '/dashboard',
  ForgotPassword = '/forgot-password',
  Index = '/',
  Login = '/login',
  Logout = '/logout',
  Onboarding = '/onboarding',
  Profile = '/profile',
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
