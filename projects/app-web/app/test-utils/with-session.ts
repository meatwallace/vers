import { AppLoadContext } from 'react-router';
import {
  SessionData,
  SessionKey,
  verifySessionStorage,
} from '~/session/verify-session-storage.server';
import { combineCookies } from './combine-cookies';

interface DataFnArgs {
  context: AppLoadContext;
  params: Record<string, string | undefined>;
  request: Request;
}

/**
 * Wraps a React Router loader or action function and provides a callback for
 * adding session data to the request.
 *
 * @param dataFn - The loader or action function to be wrapped.
 * @param sessionCallbackFn - The callback function for adding session data to the request.
 * @returns The wrapped loader or action function.
 */
export function withSession<Args extends DataFnArgs, Data>(
  dataFn: (args: Args) => Promise<Data>,
  verifySessionData: Partial<SessionData>,
) {
  return async (args: Args): Promise<Data> => {
    const verifySession = await verifySessionStorage.getSession(
      args.request.headers.get('cookie'),
    );

    for (const [key, value] of Object.entries(verifySessionData)) {
      verifySession.set(key as SessionKey, value);
    }

    const setCookieHeader =
      await verifySessionStorage.commitSession(verifySession);

    const existingCookie = args.request.headers.get('cookie');

    const cookieHeader = combineCookies(existingCookie, setCookieHeader);

    args.request.headers.set('cookie', cookieHeader);

    return dataFn(args);
  };
}
