import { YogaInitialContext } from 'graphql-yoga';
import { Context as HonoContext } from 'hono';
import { ServiceID } from '@chrono/service-types';
import { getTokenFromHeader } from '@chrono/service-utils';
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

  const userID = honoCtx.get('userID');
  const sessionID = honoCtx.get('sessionID');

  const sharedContext = {
    request: yogaCtx.request,
    ipAddress: honoCtx.get('ipAddress'),
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
      user: null,
      session,
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
      user,
      session,
    };

    return authedContext;
  }

  // if both userID or sessionID are missing, return an anonymous context
  return {
    ...sharedContext,
    user: null,
    session: null,
  };
}
