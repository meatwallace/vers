export enum Routes {
  Index = '/',

  AuthAuth0 = '/auth/auth0',
  AuthCallback = '/auth/callback',
  AuthLogout = '/auth/logout',

  Dashboard = '/dashboard',

  CreateWorld = '/worlds/create',
  CreateWorldWizard = '/worlds/create/:worldID',
  DeleteWorld = '/worlds/delete/:worldID',
}
