import { redirect } from 'react-router';
import { Routes } from '~/types';
import { verifySessionStorage } from '~/session/verify-session-storage.server.ts';
import { SESSION_KEY_VERIFY_ONBOARDING_EMAIL } from '~/session/consts.ts';
import { requireAnonymous } from '~/utils/require-anonymous.server.ts';

export async function requireOnboardingEmail(
  request: Request,
): Promise<string> {
  await requireAnonymous(request);

  const verifySession = await verifySessionStorage.getSession(
    request.headers.get('cookie'),
  );

  const email = verifySession.get(SESSION_KEY_VERIFY_ONBOARDING_EMAIL);

  if (typeof email !== 'string' || !email) {
    throw redirect(Routes.Signup);
  }

  return email;
}
