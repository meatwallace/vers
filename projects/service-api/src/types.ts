import { MutationErrorPayload } from '~/schema/types/mutation-error-payload';
import { EmailService } from '~/services/email-service/types';
import { SessionService } from '~/services/session-service/types';
import { UserData, UserService } from '~/services/user-service/types';
import { VerificationService } from '~/services/verification-service/types';
import { WorldService } from '~/services/world-service/types';
import { z } from 'zod';
import { envSchema } from './env';

export type Env = z.infer<typeof envSchema>;

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
