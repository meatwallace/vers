import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { AuthorizationError } from 'remix-auth';
import { authenticator } from '../../authenticator.server';
import { sessionStorage } from '../../session-storage.server';
import { Routes } from '../../types';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const user = await authenticator.authenticate('auth0', request, {
      throwOnError: true,
    });

    const session = await sessionStorage.getSession(
      request.headers.get('cookie'),
    );

    session.set(authenticator.sessionKey, user.id);

    const headers = new Headers({
      'set-cookie': await sessionStorage.commitSession(session),
    });

    return redirect(Routes.Dashboard, { headers });
  } catch (error: unknown) {
    if (error instanceof Response) {
      return error;
    }

    // TODO(#15): handle auth errors
    if (error instanceof AuthorizationError) {
      // TODO(#16): capture via Sentry
      throw error;
    }

    // TODO(#16): capture via Sentry
    throw error;
  }
};
