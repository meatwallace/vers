import { ActionFunction, LoaderFunction } from 'react-router';
import { authSessionStorage } from '~/session/auth-session-storage.server';
import { createAuthedUser } from '~/test-utils/create-authed-user.ts';
import { combineCookies } from './combine-cookies';

interface Config {
  sessionID?: string;
  user?: {
    email?: string;
    id?: string;
    is2FAEnabled?: boolean;
    name?: string;
    password?: string;
  };
}

export function withAuthedUser(
  dataFn: ActionFunction | LoaderFunction,
  config: Config = {},
): ActionFunction | LoaderFunction {
  return async ({ request, ...rest }) => {
    const { accessToken, refreshToken, session } = await createAuthedUser(
      config.user ?? {},
      config.sessionID,
    );

    const authSession = await authSessionStorage.getSession(
      request.headers.get('cookie'),
    );

    authSession.set('accessToken', accessToken);
    authSession.set('refreshToken', refreshToken);
    authSession.set('sessionID', session.id);

    const setCookieHeader = await authSessionStorage.commitSession(authSession);

    const existingCookie = request.headers.get('cookie');
    const cookieHeader = combineCookies(setCookieHeader, existingCookie);

    request.headers.set('cookie', cookieHeader);

    return dataFn({ request, ...rest });
  };
}
