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

export type Auth0UserInfo = {
  sub?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  middle_name?: string;
  nickname?: string;
  preferred_username?: string;
  profile?: string;
  picture?: string;
  website?: string;
  email?: string;
  email_verified?: boolean;
  gender?: string;
  birthdate?: string;
  zoneinfo?: string;
  locale?: string;
  phone_number?: string;
  phone_number_verified?: boolean;
  address?: {
    country?: string;
  };
  updated_at?: string;
  org_id?: string;
  org_name?: string;
};
