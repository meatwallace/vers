import { AppLoadContext } from 'react-router';
import { verifySessionStorage } from '~/session/verify-session-storage.server';
import { combineCookies } from './combine-cookies';

interface SessionConfig {
  onboardingEmail?: string;
  transactionID?: string;
  transactionToken?: string;
  unverifiedSessionID?: string;
}

interface DataFnArgs {
  context: AppLoadContext;
  params: Record<string, string | undefined>;
  request: Request;
}

/**
 * Wraps a React Router loader or action function and adds session data to the request.
 *
 * @param dataFn - The loader or action function to be wrapped.
 * @param config - The configuration object containing session data.
 * @returns The wrapped loader or action function.
 */
export function withSession<Args extends DataFnArgs, Data>(
  dataFn: (args: Args) => Promise<Data>,
  config: SessionConfig,
) {
  return async (args: Args): Promise<Data> => {
    const verifySession = await verifySessionStorage.getSession(
      args.request.headers.get('cookie'),
    );

    if (config.onboardingEmail) {
      verifySession.set('onboardingEmail', config.onboardingEmail);
    }

    if (config.transactionID) {
      verifySession.set('transactionID', config.transactionID);
    }

    if (config.transactionToken) {
      verifySession.set('transactionToken', config.transactionToken);
    }

    if (config.unverifiedSessionID) {
      verifySession.set('unverifiedSessionID', config.unverifiedSessionID);
    }

    const setCookieHeader =
      await verifySessionStorage.commitSession(verifySession);

    const existingCookie = args.request.headers.get('cookie');
    const cookieHeader = combineCookies(setCookieHeader, existingCookie);

    args.request.headers.set('cookie', cookieHeader);

    return dataFn(args);
  };
}
