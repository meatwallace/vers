import { redirect } from 'react-router';
import { safeRedirect } from 'remix-utils/safe-redirect';
import invariant from 'tiny-invariant';
import {
  SESSION_KEY_VERIFY_TRANSACTION_ID,
  SESSION_KEY_VERIFY_TRANSACTION_TOKEN,
} from '~/session/consts.ts';
import { verifySessionStorage } from '~/session/verify-session-storage.server.ts';
import { type HandleVerificationContext } from './types.ts';

export async function handleResetPassword(ctx: HandleVerificationContext) {
  invariant(
    ctx.submission.status === 'success',
    'submission should be successful by now',
  );

  const verifySession = await verifySessionStorage.getSession();

  // clean up the pending transaction ID & capture our transaction token
  verifySession.unset(SESSION_KEY_VERIFY_TRANSACTION_ID);
  verifySession.set(SESSION_KEY_VERIFY_TRANSACTION_TOKEN, ctx.transactionToken);

  return redirect(safeRedirect(ctx.submission.value.redirect), {
    headers: {
      'set-cookie': await verifySessionStorage.commitSession(verifySession),
    },
  });
}
