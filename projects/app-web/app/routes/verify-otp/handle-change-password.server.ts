import { redirect } from 'react-router';
import invariant from 'tiny-invariant';
import { verifySessionStorage } from '~/session/verify-session-storage.server.ts';
import { Routes } from '~/types.ts';
import { HandleVerificationContext } from './types.ts';

export async function handleChangePassword(ctx: HandleVerificationContext) {
  invariant(
    ctx.submission.status === 'success',
    'submission should be successful by now',
  );

  const verifySession = await verifySessionStorage.getSession();

  // clean up the pending transaction ID & capture our transaction token
  verifySession.unset('changePassword#transactionID');
  verifySession.set('changePassword#transactionToken', ctx.transactionToken);

  return redirect(Routes.AccountChangePassword, {
    headers: {
      'set-cookie': await verifySessionStorage.commitSession(verifySession),
    },
  });
}
