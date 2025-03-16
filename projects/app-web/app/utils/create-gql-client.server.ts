import { redirect } from 'react-router';
import { Client, fetchExchange } from '@urql/core';
import { authExchange as createAuthExchange } from '@urql/exchange-auth';
import { UnreachableCodeError } from '@vers/utils';
import { authSessionStorage } from '~/session/auth-session-storage.server';
import { storeAuthPayload } from '~/session/store-auth-payload';
import { verifySessionStorage } from '~/session/verify-session-storage.server';
import { Routes } from '~/types';
import { isURQLFetchError } from './is-urql-fetch-error.server';
import { logout } from './logout.server';
import { refreshAccessToken } from './refresh-access-token.server';

/**
 * Creates an Apollo GraphQL client.
 *
 * `authorization` and `x-session-id` headers are added to each operation
 * if values are available in the session storage.
 *
 * @param request - The request object
 * @returns An Apollo Client instance
 */
export async function createGQLClient(request: Request): Promise<Client> {
  const authSession = await authSessionStorage.getSession(
    request.headers.get('cookie'),
  );

  const verifySession = await verifySessionStorage.getSession(
    request.headers.get('cookie'),
  );

  // eslint-disable-next-line @typescript-eslint/require-await
  const authExchange = createAuthExchange(async (utils) => {
    return {
      addAuthToOperation: (operation) => {
        const accessToken = authSession.get('accessToken');
        const sessionID = authSession.get('sessionID');
        const unverifiedSessionID = verifySession.get('login2FA#sessionID');

        const headers: Record<string, string> = {};

        if (accessToken) {
          headers.authorization = `Bearer ${accessToken}`;
        }

        if (unverifiedSessionID) {
          headers['x-session-id'] = unverifiedSessionID;
        } else if (sessionID) {
          headers['x-session-id'] = sessionID;
        }

        return utils.appendHeaders(operation, headers);
      },
      didAuthError(error) {
        return isURQLFetchError(error) && error.response.status === 401;
      },
      refreshAuth: async () => {
        const refreshToken = authSession.get('refreshToken');

        if (!refreshToken) {
          await logout(request, { redirectTo: Routes.Login });

          throw new UnreachableCodeError('logout throws a redirect');
        }

        const authPayload = await refreshAccessToken(request, {
          refreshToken,
          utils,
        });

        storeAuthPayload(authSession, authPayload);

        const setCookieHeader =
          await authSessionStorage.commitSession(authSession);

        // redirect to the same URL with the refreshed session
        throw redirect(request.url, {
          headers: {
            'set-cookie': setCookieHeader,
          },
        });
      },
    };
  });

  const client = new Client({
    exchanges: [authExchange, fetchExchange],
    url: import.meta.env.VITE_API_URL,
  });

  return client;
}
