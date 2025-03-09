import { z } from 'zod';
import { MutationErrorPayload } from '~/schema/types/mutation-error-payload';
import { EmailService } from '~/services/email-service/types';
import { SessionData, SessionService } from '~/services/session-service/types';
import { UserData, UserService } from '~/services/user-service/types';
import { VerificationService } from '~/services/verification-service/types';
import { envSchema } from './env';

export type Env = z.infer<typeof envSchema>;

export interface AuthedContext {
  ipAddress: string;
  request: Request;
  services: Services;
  session: SessionData;
  user: UserData;
}

export interface UnverifiedAuthContext {
  ipAddress: string;
  request: Request;
  services: Services;
  session: SessionData;
  user: null;
}

export interface AnonymousContext {
  ipAddress: string;
  request: Request;
  services: Services;
  session: null;
  user: null;
}

export type Context = AnonymousContext | AuthedContext | UnverifiedAuthContext;

export interface Services {
  email: EmailService;
  session: SessionService;
  user: UserService;
  verification: VerificationService;
}

export type StandardMutationPayload<T> =
  | T
  | typeof MutationErrorPayload.$inferType;
