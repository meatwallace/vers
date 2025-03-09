import { ActionFunction, LoaderFunction } from 'react-router';
import { authSessionStorage } from '~/session/auth-session-storage.server';
import {
  SESSION_KEY_AUTH_ACCESS_TOKEN,
  SESSION_KEY_AUTH_REFRESH_TOKEN,
  SESSION_KEY_AUTH_SESSION_ID,
} from '~/session/consts';
import { createAuthedUser } from '~/test-utils/create-authed-user.ts';
import { combineCookies } from './combine-cookies';

interface Config {
  sessionID?: string;
  user?: {
    id?: string;
    email?: string;
    password?: string;
    name?: string;
    is2FAEnabled?: boolean;
  };
}

export function withAuthedUser(
  dataFn: LoaderFunction | ActionFunction,
  config: Config = {},
): LoaderFunction | ActionFunction {
  return async ({ request, ...rest }) => {
    const { accessToken, refreshToken, session } = await createAuthedUser(
      config.user ?? {},
      config.sessionID,
    );

    const authSession = await authSessionStorage.getSession(
      request.headers.get('cookie'),
    );

    authSession.set(SESSION_KEY_AUTH_ACCESS_TOKEN, accessToken);
    authSession.set(SESSION_KEY_AUTH_REFRESH_TOKEN, refreshToken);
    authSession.set(SESSION_KEY_AUTH_SESSION_ID, session.id);

    const setCookieHeader = await authSessionStorage.commitSession(authSession);

    const existingCookie = request.headers.get('cookie');
    const cookieHeader = combineCookies(setCookieHeader, existingCookie);

    request.headers.set('cookie', cookieHeader);

    return dataFn({ request, ...rest });
  };
}
