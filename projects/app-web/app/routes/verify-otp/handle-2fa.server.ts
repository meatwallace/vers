import { redirect } from 'react-router';
import invariant from 'tiny-invariant';
import { FinishLoginWith2FAMutation } from '~/data/mutations/finish-login-with-2fa';
import { authSessionStorage } from '~/session/auth-session-storage.server.ts';
import { storeAuthPayload } from '~/session/store-auth-payload.ts';
import { verifySessionStorage } from '~/session/verify-session-storage.server.ts';
import { Routes } from '~/types.ts';
import { handleGQLError } from '~/utils/handle-gql-error.ts';
import { isMutationError } from '~/utils/is-mutation-error.ts';
import { HandleVerificationContext } from './types.ts';

export async function handle2FA(ctx: HandleVerificationContext) {
  invariant(
    ctx.submission.status === 'success',
    'submission should be successful by now',
  );

  const result = await ctx.client.mutation(FinishLoginWith2FAMutation, {
    input: {
      target: ctx.submission.value.target,
      transactionToken: ctx.transactionToken,
    },
  });

  if (result.error) {
    handleGQLError(result.error);

    throw result.error;
  }

  invariant(result.data, 'if no error, there must be data');

  if (isMutationError(result.data.finishLoginWith2FA)) {
    throw new Error(result.data.finishLoginWith2FA.error.message);
  }

  const verifySession = await verifySessionStorage.getSession(
    ctx.request.headers.get('cookie'),
  );

  const authSession = await authSessionStorage.getSession(
    ctx.request.headers.get('cookie'),
  );

  storeAuthPayload(authSession, result.data.finishLoginWith2FA);

  const redirectTo = ctx.submission.value.redirect ?? Routes.Dashboard;

  return redirect(redirectTo, {
    headers: {
      'set-cookie': [
        await verifySessionStorage.destroySession(verifySession),
        await authSessionStorage.commitSession(authSession, {
          expires: new Date(result.data.finishLoginWith2FA.session.expiresAt),
        }),
      ].join(', '),
    },
  });
}
