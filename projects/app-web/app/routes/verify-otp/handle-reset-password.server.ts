import invariant from 'tiny-invariant';
import { redirect } from 'react-router';
import { safeRedirect } from 'remix-utils/safe-redirect';
import {
  SESSION_KEY_VERIFY_RESET_PASSWORD_EMAIL,
  SESSION_KEY_VERIFY_RESET_PASSWORD_TOKEN,
} from '~/session/consts.ts';
import { verifySessionStorage } from '~/session/verify-session-storage.server.ts';
import { type HandleVerificationContext } from './types.ts';

export async function handleResetPassword(ctx: HandleVerificationContext) {
  invariant(
    ctx.submission.status === 'success',
    'submission should be successful by now',
  );

  invariant(ctx.submission.value.redirect, 'redirect param is required');

  const redirectParamsString = ctx.submission.value.redirect.split('?')[1];
  const redirectSearchParams = new URLSearchParams(redirectParamsString);

  const resetToken = redirectSearchParams.get('token');

  invariant(resetToken, 'token param is required');

  const verifySession = await verifySessionStorage.getSession();

  verifySession.set(
    SESSION_KEY_VERIFY_RESET_PASSWORD_EMAIL,
    ctx.submission.value.target,
  );

  verifySession.set(SESSION_KEY_VERIFY_RESET_PASSWORD_TOKEN, resetToken);

  return redirect(safeRedirect(ctx.submission.value.redirect), {
    headers: {
      'set-cookie': await verifySessionStorage.commitSession(verifySession),
    },
  });
}
