import { Get } from 'type-fest';
import { MutationErrorPayload } from './schema/types/mutation-error-payload';
import { UserService } from './services/user-service/types';

export type Env = {
  LOGGING: 'debug' | 'info' | 'warn' | 'error';
  NODE_ENV: 'development' | 'test' | 'production';

  API_IDENTIFIER: string;
  AUTH0_DOMAIN: string;

  // service urls
  USERS_API_URL: string;

  // utils
  isProduction: boolean;
  isDevelopment: boolean;
};

export type Context = {
  request: Request;
  services: Services;
};

export type Services = {
  users: UserService;
};

export type StandardMutationPayload<T> =
  | Get<T, '$inferType'>
  | typeof MutationErrorPayload.$inferType;
