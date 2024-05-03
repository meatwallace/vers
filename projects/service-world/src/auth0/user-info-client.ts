import { UserInfoClient } from 'auth0';
import { env } from '../env';

export const userInfoClient = new UserInfoClient({
  domain: env.AUTH0_DOMAIN,
});
