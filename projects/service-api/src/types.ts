import { MutationErrorPayload } from '~/schema/types/mutation-error-payload';
import { EmailService } from '~/services/email-service/types';
import { SessionService } from '~/services/session-service/types';
import { UserData, UserService } from '~/services/user-service/types';
import { VerificationService } from '~/services/verification-service/types';
import { WorldService } from '~/services/world-service/types';

export type Env = {
  HOSTNAME: string;
  PORT: number;

  LOGGING: 'debug' | 'info' | 'warn' | 'error';
  NODE_ENV: 'development' | 'test' | 'production';

  API_IDENTIFIER: string;
  JWT_SIGNING_SECRET: string;

  APP_WEB_URL: string;

  // service urls
  USERS_SERVICE_URL: string;
  WORLDS_SERVICE_URL: string;
  SESSIONS_SERVICE_URL: string;
  VERIFICATIONS_SERVICE_URL: string;
  EMAILS_SERVICE_URL: string;

  // utils
  isProduction: boolean;
  isDevelopment: boolean;
};

export type Context = {
  request: Request;
  user: UserData | null;
  ipAddress: string;
  services: Services;
};

export type Services = {
  email: EmailService;
  session: SessionService;
  user: UserService;
  verification: VerificationService;
  world: WorldService;
};

export type StandardMutationPayload<T> =
  | T
  | typeof MutationErrorPayload.$inferType;
