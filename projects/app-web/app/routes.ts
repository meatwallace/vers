import { type RouteConfig, index, route } from '@remix-run/route-config';

export default [
  index('routes/_index.tsx'),

  route('dashboard', 'routes/dashboard.tsx'),

  route('auth/auth0', 'routes/auth/auth0.tsx'),
  route('auth/callback', 'routes/auth/callback.tsx'),
  route('auth/logout', 'routes/auth/logout.ts'),

  route('worlds/create', 'routes/worlds/create.tsx'),
  route('worlds/create/$worldID', 'routes/worlds/create.$worldID.tsx'),
  route('worlds/delete/$worldID', 'routes/worlds/delete.$worldID.tsx'),
] satisfies RouteConfig;
