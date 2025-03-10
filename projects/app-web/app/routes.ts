import {
  index,
  layout,
  route,
  type RouteConfig,
} from '@react-router/dev/routes';
import { Routes } from './types.ts';

export default [
  index('routes/_index/route.tsx'),

  route(Routes.Login, 'routes/login/route.tsx'),
  route(Routes.Signup, 'routes/signup/route.tsx'),
  route(Routes.Onboarding, 'routes/onboarding/route.tsx'),
  route(Routes.VerifyOTP, 'routes/verify-otp/route.tsx'),
  route(Routes.Logout, 'routes/logout/route.tsx'),
  route(Routes.ForgotPassword, 'routes/forgot-password/route.tsx'),
  route(Routes.ResetPassword, 'routes/reset-password/route.tsx'),
  route(Routes.ResetPasswordStarted, 'routes/reset-password-started/route.tsx'),

  layout('layouts/authed-layout.tsx', [
    route(Routes.Dashboard, 'routes/dashboard/route.tsx'),
    route(Routes.Profile, 'routes/profile/route.tsx'),
    route(Routes.ProfileVerify2FA, 'routes/profile_verify-2fa/route.tsx'),
  ]),
] satisfies RouteConfig;
