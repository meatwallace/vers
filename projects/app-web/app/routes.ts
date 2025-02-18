import { type RouteConfig, index, route } from '@react-router/dev/routes';
import { Routes } from './types.ts';

export default [
  index('routes/_index.tsx'),

  route(Routes.Dashboard, 'routes/dashboard.tsx'),

  route(Routes.Login, 'routes/login.tsx'),
  route(Routes.Signup, 'routes/signup.tsx'),
  route(Routes.Onboarding, 'routes/onboarding/onboarding.tsx'),
  route(Routes.VerifyOTP, 'routes/verify-otp/verify-otp.tsx'),
  route(Routes.Logout, 'routes/logout.tsx'),
  route(Routes.ForgotPassword, 'routes/forgot-password.tsx'),
  route(Routes.ResetPassword, 'routes/reset-password.tsx'),
  route(Routes.ResetPasswordStarted, 'routes/reset-password-started.tsx'),

  route(Routes.CreateWorld, 'routes/worlds/create.tsx'),
  route(Routes.CreateWorldWizard, 'routes/worlds/create.$worldID.tsx'),
  route(Routes.DeleteWorld, 'routes/worlds/delete.$worldID.tsx'),
] satisfies RouteConfig;
