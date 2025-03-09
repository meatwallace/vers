import { ActionFunction, LoaderFunction } from 'react-router';
import { verifySessionStorage } from '~/session/verify-session-storage.server';
import { combineCookies } from './combine-cookies';

interface SessionConfig {
  onboardingEmail?: string;
  transactionID?: string;
  transactionToken?: string;
  unverifiedSessionID?: string;
}

/**
 * Wraps a React Router loader or action function and adds session data to the request.
 *
 * @param dataFn - The loader or action function to be wrapped.
 * @param config - The configuration object containing session data.
 * @returns The wrapped loader or action function.
 */
export function withSession(
  dataFn: ActionFunction | LoaderFunction,
  config: SessionConfig,
): ActionFunction | LoaderFunction {
  return async ({ request, ...rest }) => {
    const verifySession = await verifySessionStorage.getSession(
      request.headers.get('cookie'),
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

    const existingCookie = request.headers.get('cookie');
    const cookieHeader = combineCookies(setCookieHeader, existingCookie);

    request.headers.set('cookie', cookieHeader);

    return dataFn({ request, ...rest });
  };
}
