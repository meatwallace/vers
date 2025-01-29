export enum Routes {
  Index = '/',

  Signup = '/signup',
  Login = '/login',
  Logout = '/logout',
  Onboarding = '/onboarding',

  VerifyOTP = '/verify-otp',

  Dashboard = '/dashboard',

  CreateWorld = '/worlds/create',
  CreateWorldWizard = '/worlds/create/:worldID',
  DeleteWorld = '/worlds/delete/:worldID',
}
