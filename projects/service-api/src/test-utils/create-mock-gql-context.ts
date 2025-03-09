import { createId } from '@paralleldrive/cuid2';
import { ServiceID } from '@vers/service-types';
import { db } from '~/mocks/db';
import { env } from '../env';
import { createEmailService } from '../services/email-service/create-email-service';
import { createSessionService } from '../services/session-service/create-session-service';
import { createUserService } from '../services/user-service/create-user-service';
import { createVerificationService } from '../services/verification-service/create-verification-service';
import { AuthedContext, Context } from '../types';

interface MockContextConfig {
  accessToken?: string;
  ipAddress?: string;
  session?: AuthedContext['session'];
  user?: AuthedContext['user'];
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
    ipAddress,
    request,
    services: {
      email: createEmailService({
        accessToken: config.accessToken,
        apiURL: env.EMAILS_SERVICE_URL,
        requestID,
        serviceID: ServiceID.ServiceEmail,
      }),
      session: createSessionService({
        accessToken: config.accessToken,
        apiURL: env.SESSIONS_SERVICE_URL,
        requestID,
        serviceID: ServiceID.ServiceSession,
      }),
      user: createUserService({
        accessToken: config.accessToken,
        apiURL: env.USERS_SERVICE_URL,
        requestID,
        serviceID: ServiceID.ServiceUser,
      }),
      verification: createVerificationService({
        accessToken: config.accessToken,
        apiURL: env.VERIFICATIONS_SERVICE_URL,
        requestID,
        serviceID: ServiceID.ServiceVerification,
      }),
    },
  };

  if (!config.user && !config.session) {
    return {
      ...sharedContext,
      session: null,
      user: null,
    };
  }

  const user = config.user ?? db.user.create({ email: 'test@example.com' });
  const session = config.session ?? db.session.create({ userID: user.id });

  return {
    ...sharedContext,
    session,
    user,
  };
}
