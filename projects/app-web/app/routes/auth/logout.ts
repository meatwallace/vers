import { ActionFunctionArgs, redirect } from 'react-router';
import { sessionStorage } from '../../session-storage.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  const logoutURL = new URL(import.meta.env.VITE_AUTH0_LOGOUT_URL);

  logoutURL.searchParams.set('client_id', import.meta.env.VITE_AUTH0_CLIENT_ID);
  logoutURL.searchParams.set('returnTo', import.meta.env.VITE_AUTH0_RETURN_URL);

  const session = await sessionStorage.getSession(
    request.headers.get('cookie'),
  );

  return redirect(logoutURL.toString(), {
    headers: {
      'set-cookie': await sessionStorage.destroySession(session),
    },
  });
};
