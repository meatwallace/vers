import { GraphQLClient } from 'graphql-request';
import { redirect } from 'react-router';
import { authSessionStorage } from '~/session/auth-session-storage.server.ts';
import { Routes } from '~/types';
import {
  SESSION_KEY_AUTH_ACCESS_TOKEN,
  SESSION_KEY_AUTH_REFRESH_TOKEN,
  SESSION_KEY_AUTH_SESSION_ID,
} from '~/session/consts.ts';
import { isExpiredJWT } from './is-expired-jwt.server.ts';
import { logout } from './logout.server.ts';
import { refreshAccessToken } from './refresh-access-token.server.ts';

type AuthResult = {
  sessionID: string;
  accessToken: string;
  refreshToken: string;
};

type Context = {
  client: GraphQLClient;
};

export async function requireAuth(
  request: Request,
  ctx: Context,
): Promise<AuthResult> {
  const authSession = await authSessionStorage.getSession(
    request.headers.get('cookie'),
  );

  const sessionID = authSession.get(SESSION_KEY_AUTH_SESSION_ID);
  const accessToken = authSession.get(SESSION_KEY_AUTH_ACCESS_TOKEN);
  const refreshToken = authSession.get(SESSION_KEY_AUTH_REFRESH_TOKEN);

  if (!sessionID || !accessToken || !refreshToken) {
    throw redirect(Routes.Login);
  }

  ctx.client.setHeader('authorization', `Bearer ${accessToken}`);

  const isExpiredAccessToken = isExpiredJWT(accessToken);

  if (isExpiredAccessToken && isExpiredJWT(refreshToken)) {
    await logout(request, {
      client: ctx.client,
      redirectTo: Routes.Login,
    });
  }

  if (isExpiredAccessToken) {
    const authPayload = await refreshAccessToken(request, {
      client: ctx.client,
      refreshToken,
    });

    authSession.set(SESSION_KEY_AUTH_ACCESS_TOKEN, authPayload.accessToken);
    authSession.set(SESSION_KEY_AUTH_REFRESH_TOKEN, authPayload.refreshToken);
    authSession.set(SESSION_KEY_AUTH_SESSION_ID, authPayload.sessionID);

    const setCookieHeader = await authSessionStorage.commitSession(authSession);

    // redirect to the same URL with the refreshed session
    throw redirect(request.url, {
      headers: {
        'set-cookie': setCookieHeader,
      },
    });
  }

  return { sessionID, accessToken, refreshToken };
}
