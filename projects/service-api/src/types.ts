import { users } from '@chrononomicon/postgres-schema';
import { MutationErrorPayload } from './schema/types/mutation-error-payload';
import { UserService } from './services/user-service/types';
import { WorldService } from './services/world-service/types';

export type Env = {
  HOSTNAME: string;
  PORT: number;

  LOGGING: 'debug' | 'info' | 'warn' | 'error';
  NODE_ENV: 'development' | 'test' | 'production';

  API_IDENTIFIER: string;
  AUTH0_DOMAIN: string;

  // service urls
  USERS_SERVICE_URL: string;
  WORLDS_SERVICE_URL: string;

  // utils
  isProduction: boolean;
  isDevelopment: boolean;
};

export type Context = {
  request: Request;
  user: typeof users.$inferSelect | null;
  services: Services;
};

export type Services = {
  user: UserService;
  world: WorldService;
};

export type StandardMutationPayload<T> =
  | T
  | typeof MutationErrorPayload.$inferType;
