import { GraphQLClient } from 'graphql-request';
import { db } from '~/mocks/db';
import { authSessionStorage } from '~/session/auth-session-storage.server.ts';
import {
  SESSION_KEY_AUTH_ACCESS_TOKEN,
  SESSION_KEY_AUTH_REFRESH_TOKEN,
  SESSION_KEY_AUTH_SESSION_ID,
} from '~/session/consts.ts';
import { createJWT } from './create-jwt';

type Context = {
  request: Request;
  client?: GraphQLClient;
  sessionID?: string;
  user?: {
    id?: string;
    email?: string;
    password?: string;
    name?: string;
  };
};

export async function createAuthedUser(ctx: Context) {
  const user = db.user.create({ ...ctx.user });

  const accessToken = await createJWT({
    sub: user.id,
    audience: 'test.com',
    issuer: 'http://test.com/',
  });

  const refreshToken = await createJWT({
    sub: user.id,
    audience: 'test.com',
    issuer: 'http://test.com/',
    expirationTime: '1d',
  });

  const session = db.session.create({
    id: ctx.sessionID ?? 'test-session-id',
    userID: user.id,
    refreshToken,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
  });

  const authSession = await authSessionStorage.getSession(
    ctx.request.headers.get('cookie'),
  );

  authSession.set(SESSION_KEY_AUTH_ACCESS_TOKEN, accessToken);
  authSession.set(SESSION_KEY_AUTH_REFRESH_TOKEN, refreshToken);
  authSession.set(SESSION_KEY_AUTH_SESSION_ID, session.id);

  const cookieHeader = await authSessionStorage.commitSession(authSession);

  ctx.request.headers.set('cookie', cookieHeader);

  if (ctx.client) {
    ctx.client.setHeader('authorization', `Bearer ${accessToken}`);
  }
}
