import { createId } from '@paralleldrive/cuid2';
import { ServiceID } from '@chrono/service-types';
import { Context } from '../types';
import { createEmailService } from '../services/email-service/create-email-service';
import { createUserService } from '../services/user-service/create-user-service';
import { createWorldService } from '../services/world-service/create-world-service';
import { createSessionService } from '../services/session-service/create-session-service';
import { createVerificationService } from '../services/verification-service/create-verification-service';
import { env } from '../env';

type MockContextConfig = {
  accessToken?: string;
  ipAddress?: string;
  user?: Context['user'];
};

export function createMockGQLContext(config: MockContextConfig): Context {
  const request = new Request('https://test.com/');

  if (config.accessToken) {
    request.headers.set('authorization', `Bearer ${config.accessToken}`);
  }

  const requestID = createId();

  return {
    request,
    user: config.user ?? null,
    ipAddress: config.ipAddress ?? '127.0.0.1',
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
}
