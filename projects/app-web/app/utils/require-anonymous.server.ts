import { redirect } from 'react-router';
import { Routes } from '~/types';
import { authSessionStorage } from '~/session/auth-session-storage.server.ts';
import { SESSION_KEY_AUTH_SESSION_ID } from '~/session/consts.ts';

export async function requireAnonymous(request: Request) {
  const authSession = await authSessionStorage.getSession(
    request.headers.get('cookie'),
  );

  const sessionID = authSession.get(SESSION_KEY_AUTH_SESSION_ID);

  if (sessionID) {
    throw redirect(Routes.Dashboard);
  }
}
