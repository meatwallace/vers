import { z } from 'zod';
import { MutationErrorPayload } from '~/schema/types/mutation-error-payload';
import { EmailService } from '~/services/email-service/types';
import { SessionData, SessionService } from '~/services/session-service/types';
import { UserData, UserService } from '~/services/user-service/types';
import { VerificationService } from '~/services/verification-service/types';
import { WorldService } from '~/services/world-service/types';
import { envSchema } from './env';

export type Env = z.infer<typeof envSchema>;

export interface AuthedContext {
  request: Request;
  user: UserData;
  session: SessionData;
  ipAddress: string;
  services: Services;
}

export interface UnverifiedAuthContext {
  request: Request;
  user: null;
  session: SessionData;
  ipAddress: string;
  services: Services;
}

export interface AnonymousContext {
  request: Request;
  user: null;
  session: null;
  ipAddress: string;
  services: Services;
}

export type Context = AuthedContext | UnverifiedAuthContext | AnonymousContext;

export interface Services {
  email: EmailService;
  session: SessionService;
  user: UserService;
  verification: VerificationService;
  world: WorldService;
}

export type StandardMutationPayload<T> =
  | T
  | typeof MutationErrorPayload.$inferType;
