import { redirect } from 'react-router';
import { safeRedirect } from 'remix-utils/safe-redirect';
import invariant from 'tiny-invariant';
import { verifySessionStorage } from '~/session/verify-session-storage.server.ts';
import { type HandleVerificationContext } from './types.ts';

export async function handleResetPassword(ctx: HandleVerificationContext) {
  invariant(
    ctx.submission.status === 'success',
    'submission should be successful by now',
  );

  const verifySession = await verifySessionStorage.getSession();

  // clean up the pending transaction ID & capture our transaction token
  verifySession.unset('transactionID');
  verifySession.set('transactionToken', ctx.transactionToken);

  return redirect(safeRedirect(ctx.submission.value.redirect), {
    headers: {
      'set-cookie': await verifySessionStorage.commitSession(verifySession),
    },
  });
}
