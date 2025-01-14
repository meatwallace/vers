import { LoaderFunctionArgs, redirect } from 'react-router';
import { authenticator } from '../../authenticator.server';
import { sessionStorage } from '../../session-storage.server';
import { Routes } from '../../types';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const user = await authenticator.authenticate('auth0', request);

    const session = await sessionStorage.getSession(
      request.headers.get('cookie'),
    );

    session.set('userID', user.id);

    return redirect(Routes.Dashboard, {
      headers: {
        'set-cookie': await sessionStorage.commitSession(session),
      },
    });
  } catch (error: unknown) {
    if (error instanceof Response) {
      return error;
    }

    // TODO(#15): handle auth errors

    // TODO(#16): capture via Sentry
    throw error;
  }
};
