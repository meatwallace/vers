import invariant from 'tiny-invariant';
import { redirect } from 'react-router';
import { verifySessionStorage } from '~/session/verify-session-storage.server.ts';
import { Routes } from '~/types.ts';
import { SESSION_KEY_VERIFY_ONBOARDING_EMAIL } from '~/session/consts.ts';
import { type HandleVerificationContext } from './types.ts';

export async function handleOnboarding(ctx: HandleVerificationContext) {
  invariant(
    ctx.submission.status === 'success',
    'submission should be successful by now',
  );

  const verifySession = await verifySessionStorage.getSession();

  verifySession.set(
    SESSION_KEY_VERIFY_ONBOARDING_EMAIL,
    ctx.submission.value.target,
  );

  return redirect(Routes.Onboarding, {
    headers: {
      'set-cookie': await verifySessionStorage.commitSession(verifySession),
    },
  });
}
