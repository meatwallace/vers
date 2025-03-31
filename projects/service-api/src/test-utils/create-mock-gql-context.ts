import type { ServiceRouter as CharacterServiceRouter } from '@vers/service-character';
import type { ServiceRouter as EmailServiceRouter } from '@vers/service-email';
import type { ServiceRouter as SessionServiceRouter } from '@vers/service-session';
import type { ServiceRouter as UserServiceRouter } from '@vers/service-user';
import type { ServiceRouter as VerificationServiceRouter } from '@vers/service-verification';
import { createId } from '@paralleldrive/cuid2';
import { ServiceID } from '@vers/service-types';
import { db } from '~/mocks/db';
import type { AuthedContext, Context } from '../types';
import { env } from '../env';
import { createTRPCClient } from '../utils/create-trpc-client';

interface MockContextConfig {
  accessToken?: string;
  ipAddress?: string;
  requestID?: string;
  session?: AuthedContext['session'];
  user?: AuthedContext['user'];
}

export function createMockGQLContext(config: MockContextConfig): Context {
  const request = new Request('https://test.com/');

  if (config.accessToken) {
    request.headers.set('authorization', `Bearer ${config.accessToken}`);
  }

  const requestID = config.requestID ?? createId();

  const ipAddress =
    config.session?.ipAddress ?? config.ipAddress ?? '127.0.0.1';

  const character = createTRPCClient<CharacterServiceRouter>({
    accessToken: config.accessToken,
    apiURL: env.CHARACTERS_SERVICE_URL,
    requestID,
    serviceID: ServiceID.ServiceCharacter,
  });

  const email = createTRPCClient<EmailServiceRouter>({
    accessToken: config.accessToken,
    apiURL: env.EMAILS_SERVICE_URL,
    requestID,
    serviceID: ServiceID.ServiceEmail,
  });

  const user = createTRPCClient<UserServiceRouter>({
    accessToken: config.accessToken,
    apiURL: env.USERS_SERVICE_URL,
    requestID,
    serviceID: ServiceID.ServiceUser,
  });

  const session = createTRPCClient<SessionServiceRouter>({
    accessToken: config.accessToken,
    apiURL: env.SESSIONS_SERVICE_URL,
    requestID,
    serviceID: ServiceID.ServiceSession,
  });

  const verification = createTRPCClient<VerificationServiceRouter>({
    accessToken: config.accessToken,
    apiURL: env.VERIFICATIONS_SERVICE_URL,
    requestID,
    serviceID: ServiceID.ServiceVerification,
  });

  const sharedContext = {
    ipAddress,
    request,
    requestID,
    services: {
      character,
      email,
      session,
      user,
      verification,
    },
  };

  if (!config.user && !config.session) {
    return {
      ...sharedContext,
      session: null,
      user: null,
    };
  }

  const authedUser =
    config.user ?? db.user.create({ email: 'test@example.com' });

  const authedSession =
    config.session ?? db.session.create({ userID: authedUser.id });

  if (!config.user) {
    return {
      ...sharedContext,
      session: authedSession,
      user: null,
    };
  }

  return {
    ...sharedContext,
    session: authedSession,
    user: authedUser,
  };
}
