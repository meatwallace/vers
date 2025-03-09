import { ServiceID } from '@chrono/service-types';
import { getTokenFromHeader } from '@chrono/service-utils';
import { YogaInitialContext } from 'graphql-yoga';
import { Context as HonoContext } from 'hono';
import { createEmailService } from '~/services/email-service/create-email-service';
import { createSessionService } from '~/services/session-service/create-session-service';
import { createUserService } from '~/services/user-service/create-user-service';
import { createVerificationService } from '~/services/verification-service/create-verification-service';
import { createWorldService } from '~/services/world-service/create-world-service';
import { env } from './env';
import { AuthedContext, Context, UnverifiedAuthContext } from './types';

export async function createYogaContext(
  yogaCtx: YogaInitialContext,
  honoCtx: HonoContext,
): Promise<Context> {
  const requestID = honoCtx.get('requestId');
  const authHeader = yogaCtx.request.headers.get('authorization');
  const accessToken = getTokenFromHeader(authHeader);

  const emailService = createEmailService({
    accessToken,
    apiURL: env.EMAILS_SERVICE_URL,
    requestID,
    serviceID: ServiceID.ServiceEmail,
  });

  const userService = createUserService({
    accessToken,
    apiURL: env.USERS_SERVICE_URL,
    requestID,
    serviceID: ServiceID.ServiceUser,
  });

  const worldService = createWorldService({
    accessToken,
    apiURL: env.WORLDS_SERVICE_URL,
    requestID,
    serviceID: ServiceID.ServiceWorld,
  });

  const sessionService = createSessionService({
    accessToken,
    apiURL: env.SESSIONS_SERVICE_URL,
    requestID,
    serviceID: ServiceID.ServiceSession,
  });

  const verificationService = createVerificationService({
    accessToken,
    apiURL: env.VERIFICATIONS_SERVICE_URL,
    requestID,
    serviceID: ServiceID.ServiceVerification,
  });

  const userID = honoCtx.get('userID');
  const sessionID = honoCtx.get('sessionID');

  const sharedContext = {
    ipAddress: honoCtx.get('ipAddress'),
    request: yogaCtx.request,
    services: {
      email: emailService,
      session: sessionService,
      user: userService,
      verification: verificationService,
      world: worldService,
    },
  };

  // if we're missing a user ID, attempt to return an unverified auth context
  if (sessionID && !userID) {
    const session = await sessionService.getSession({ id: sessionID });

    if (!session) {
      throw new Error('Invalid request');
    }

    const unverifiedAuthContext: UnverifiedAuthContext = {
      ...sharedContext,
      session,
      user: null,
    };

    return unverifiedAuthContext;
  }

  // if we have both userID and sessionID, attempt to return an authed context
  if (sessionID && userID) {
    const session = await sessionService.getSession({ id: sessionID });
    const user = await userService.getUser({ id: userID });

    if (!user || !session) {
      throw new Error('Invalid request');
    }

    const authedContext: AuthedContext = {
      ...sharedContext,
      session,
      user,
    };

    return authedContext;
  }

  // if both userID or sessionID are missing, return an anonymous context
  return {
    ...sharedContext,
    session: null,
    user: null,
  };
}
