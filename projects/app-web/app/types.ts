export enum Routes {
  CreateWorld = '/worlds/create',

  CreateWorldWizard = '/worlds/create/:worldID',
  Dashboard = '/dashboard',
  DeleteWorld = '/worlds/delete/:worldID',
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
