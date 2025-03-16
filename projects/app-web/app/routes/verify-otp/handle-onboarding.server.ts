import { redirect } from 'react-router';
import invariant from 'tiny-invariant';
import { verifySessionStorage } from '~/session/verify-session-storage.server.ts';
import { Routes } from '~/types.ts';
import { HandleVerificationContext } from './types.ts';

export async function handleOnboarding(ctx: HandleVerificationContext) {
  invariant(
    ctx.submission.status === 'success',
    'submission should be successful by now',
  );

  const verifySession = await verifySessionStorage.getSession(
    ctx.request.headers.get('cookie'),
  );

  // clean up the pending transaction ID & capture our transaction token
  verifySession.unset('onboarding#transactionID');
  verifySession.set('onboarding#transactionToken', ctx.transactionToken);
  verifySession.set('onboarding#email', ctx.submission.value.target);

  return redirect(Routes.Onboarding, {
    headers: {
      'set-cookie': await verifySessionStorage.commitSession(verifySession),
    },
  });
}
