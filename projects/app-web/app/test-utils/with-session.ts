import { ActionFunction, LoaderFunction } from 'react-router';
import {
  SESSION_KEY_VERIFY_ONBOARDING_EMAIL,
  SESSION_KEY_VERIFY_TRANSACTION_ID,
  SESSION_KEY_VERIFY_TRANSACTION_TOKEN,
  SESSION_KEY_VERIFY_UNVERIFIED_SESSION_ID,
} from '~/session/consts';
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
  dataFn: LoaderFunction | ActionFunction,
  config: SessionConfig,
): LoaderFunction | ActionFunction {
  return async ({ request, ...rest }) => {
    const verifySession = await verifySessionStorage.getSession(
      request.headers.get('cookie'),
    );

    if (config.onboardingEmail) {
      verifySession.set(
        SESSION_KEY_VERIFY_ONBOARDING_EMAIL,
        config.onboardingEmail,
      );
    }

    if (config.transactionID) {
      verifySession.set(
        SESSION_KEY_VERIFY_TRANSACTION_ID,
        config.transactionID,
      );
    }

    if (config.transactionToken) {
      verifySession.set(
        SESSION_KEY_VERIFY_TRANSACTION_TOKEN,
        config.transactionToken,
      );
    }

    if (config.unverifiedSessionID) {
      verifySession.set(
        SESSION_KEY_VERIFY_UNVERIFIED_SESSION_ID,
        config.unverifiedSessionID,
      );
    }

    const setCookieHeader =
      await verifySessionStorage.commitSession(verifySession);

    const existingCookie = request.headers.get('cookie');
    const cookieHeader = combineCookies(setCookieHeader, existingCookie);

    request.headers.set('cookie', cookieHeader);

    return dataFn({ request, ...rest });
  };
}
