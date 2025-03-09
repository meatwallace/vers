import { db } from '~/mocks/db';
import { ServiceID } from '@chrono/service-types';
import { createId } from '@paralleldrive/cuid2';
import { env } from '../env';
import { createEmailService } from '../services/email-service/create-email-service';
import { createSessionService } from '../services/session-service/create-session-service';
import { createUserService } from '../services/user-service/create-user-service';
import { createVerificationService } from '../services/verification-service/create-verification-service';
import { createWorldService } from '../services/world-service/create-world-service';
import { AuthedContext, Context } from '../types';

interface MockContextConfig {
  accessToken?: string;
  ipAddress?: string;
  user?: AuthedContext['user'];
  session?: AuthedContext['session'];
}

export function createMockGQLContext(config: MockContextConfig): Context {
  const request = new Request('https://test.com/');

  if (config.accessToken) {
    request.headers.set('authorization', `Bearer ${config.accessToken}`);
  }

  const requestID = createId();

  const ipAddress =
    config.session?.ipAddress ?? config.ipAddress ?? '127.0.0.1';

  const sharedContext = {
    request,
    ipAddress,
    services: {
      email: createEmailService({
        serviceID: ServiceID.ServiceEmail,
        apiURL: env.EMAILS_SERVICE_URL,
        accessToken: config.accessToken,
        requestID,
      }),
      user: createUserService({
        serviceID: ServiceID.ServiceUser,
        apiURL: env.USERS_SERVICE_URL,
        accessToken: config.accessToken,
        requestID,
      }),
      world: createWorldService({
        serviceID: ServiceID.ServiceWorld,
        apiURL: env.WORLDS_SERVICE_URL,
        accessToken: config.accessToken,
        requestID,
      }),
      session: createSessionService({
        serviceID: ServiceID.ServiceSession,
        apiURL: env.SESSIONS_SERVICE_URL,
        accessToken: config.accessToken,
        requestID,
      }),
      verification: createVerificationService({
        serviceID: ServiceID.ServiceVerification,
        apiURL: env.VERIFICATIONS_SERVICE_URL,
        accessToken: config.accessToken,
        requestID,
      }),
    },
  };

  if (!config.user && !config.session) {
    return {
      ...sharedContext,
      user: null,
      session: null,
    };
  }

  const user = config.user ?? db.user.create({ email: 'test@example.com' });
  const session = config.session ?? db.session.create({ userID: user.id });

  return {
    ...sharedContext,
    user,
    session,
  };
}
