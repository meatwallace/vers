import { ClientError } from 'graphql-request';
import { Routes } from '~/types';
import { logout } from './logout.server';

/**
 * Handles a 401 error by logging the user out and redirecting to the login page.
 *
 * As manually check the token's expiry on authed routes and proactively refresh
 * if needed, we can keep this flow simple when we encounter a 401.
 *
 * @param request - The request object.
 * @param error - The error object.
 */
export async function handle401Error(request: Request, error: unknown) {
  if (error instanceof ClientError && error.response.status === 401) {
    const url = new URL(request.url);
    const loginRedirect = `${url.pathname}?${url.searchParams.toString()}`;
    const searchParams = new URLSearchParams({ redirect: loginRedirect });
    const redirectTo = `${Routes.Login}?${searchParams.toString()}`;

    await logout(request, { redirectTo });
  }
}
