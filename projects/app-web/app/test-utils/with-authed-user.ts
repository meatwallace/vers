import { AppLoadContext } from 'react-router';
import { authSessionStorage } from '~/session/auth-session-storage.server';
import { createAuthedUser } from '~/test-utils/create-authed-user';
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

interface DataFnArgs {
  context: AppLoadContext;
  params: Record<string, string | undefined>;
  request: Request;
}

export function withAuthedUser<Args extends DataFnArgs, Data>(
  dataFn: (args: Args) => Promise<Data>,
  config: Config = {},
) {
  return async (args: Args): Promise<Data> => {
    const { accessToken, refreshToken, session } = await createAuthedUser(
      config.user ?? {},
      config.sessionID,
    );

    const authSession = await authSessionStorage.getSession(
      args.request.headers.get('cookie'),
    );

    authSession.set('accessToken', accessToken);
    authSession.set('refreshToken', refreshToken);
    authSession.set('sessionID', session.id);

    const setCookieHeader = await authSessionStorage.commitSession(authSession);

    const existingCookie = args.request.headers.get('cookie');
    const cookieHeader = combineCookies(existingCookie, setCookieHeader);

    args.request.headers.set('cookie', cookieHeader);

    return dataFn(args);
  };
}
