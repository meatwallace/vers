import { redirect } from 'react-router';
import invariant from 'tiny-invariant';
import {
  SESSION_KEY_VERIFY_ONBOARDING_EMAIL,
  SESSION_KEY_VERIFY_TRANSACTION_ID,
  SESSION_KEY_VERIFY_TRANSACTION_TOKEN,
} from '~/session/consts.ts';
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
  verifySession.unset(SESSION_KEY_VERIFY_TRANSACTION_ID);
  verifySession.set(SESSION_KEY_VERIFY_TRANSACTION_TOKEN, ctx.transactionToken);
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
