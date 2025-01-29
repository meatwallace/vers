import { YogaInitialContext } from 'graphql-yoga';
import { ServiceID } from '@chrono/service-types';
import { getTokenFromHeader } from '@chrono/service-utils';
import { createEmailService } from '~/services/email-service/create-email-service';
import { createSessionService } from '~/services/session-service/create-session-service';
import { createUserService } from '~/services/user-service/create-user-service';
import { createVerificationService } from '~/services/verification-service/create-verification-service';
import { createWorldService } from '~/services/world-service/create-world-service';
import { UserData } from '~/services/user-service/types';
import { Context as HonoContext } from 'hono';
import { Context } from './types';
import { env } from './env';

export async function createYogaContext(
  yogaCtx: YogaInitialContext,
  honoCtx: HonoContext,
): Promise<Context> {
  const requestID = honoCtx.get('requestId');
  const authHeader = yogaCtx.request.headers.get('authorization');
  const accessToken = getTokenFromHeader(authHeader);

  const emailService = createEmailService({
    requestID,
    serviceID: ServiceID.ServiceEmail,
    apiURL: env.EMAILS_SERVICE_URL,
    accessToken,
  });

  const userService = createUserService({
    requestID,
    serviceID: ServiceID.ServiceUser,
    apiURL: env.USERS_SERVICE_URL,
    accessToken,
  });

  const worldService = createWorldService({
    requestID,
    serviceID: ServiceID.ServiceWorld,
    apiURL: env.WORLDS_SERVICE_URL,
    accessToken,
  });

  const sessionService = createSessionService({
    requestID,
    serviceID: ServiceID.ServiceSession,
    apiURL: env.SESSIONS_SERVICE_URL,
    accessToken,
  });

  const verificationService = createVerificationService({
    requestID,
    serviceID: ServiceID.ServiceVerification,
    apiURL: env.VERIFICATIONS_SERVICE_URL,
    accessToken,
  });

  let user: UserData | null = null;

  const userID = honoCtx.get('userID');

  if (userID) {
    user = await userService.getUser({ id: userID });
  }

  return {
    request: yogaCtx.request,
    user,
    ipAddress: honoCtx.get('ipAddress'),
    services: {
      email: emailService,
      session: sessionService,
      user: userService,
      verification: verificationService,
      world: worldService,
    },
  };
}
