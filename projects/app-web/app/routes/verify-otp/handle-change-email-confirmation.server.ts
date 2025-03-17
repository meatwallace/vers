import { redirect } from 'react-router';
import invariant from 'tiny-invariant';
import { FinishChangeUserEmailMutation } from '~/data/mutations/finish-change-user-email.ts';
import { verifySessionStorage } from '~/session/verify-session-storage.server.ts';
import { Routes } from '~/types.ts';
import { handleGQLError } from '~/utils/handle-gql-error.ts';
import { isMutationError } from '~/utils/is-mutation-error.ts';
import type { HandleVerificationContext } from './types.ts';

/**
 * Handles the verification of a new email address.
 * This is the second step in the email change process, where we verify
 * the user's ownership of the new email address and complete the change.
 */
export async function handleChangeEmailConfirmation(
  ctx: HandleVerificationContext,
): Promise<Response> {
  invariant(
    ctx.submission.status === 'success',
    'submission should be successful by now',
  );

  const result = await ctx.client.mutation(FinishChangeUserEmailMutation, {
    input: {
      email: ctx.submission.value.target,
      transactionToken: ctx.transactionToken,
    },
  });

  if (result.error) {
    handleGQLError(result.error);

    throw result.error;
  }

  if (isMutationError(result.data?.finishChangeUserEmail)) {
    throw new Error(result.data.finishChangeUserEmail.error.message);
  }

  const verifySession = await verifySessionStorage.getSession(
    ctx.request.headers.get('Cookie'),
  );

  // clear all session data related to email change confirmation
  verifySession.unset('changeEmailConfirm#transactionID');
  verifySession.unset('changeEmailConfirm#transactionToken');

  const setCookieHeader =
    await verifySessionStorage.commitSession(verifySession);

  return redirect(Routes.Profile, {
    headers: {
      'set-cookie': setCookieHeader,
    },
  });
}
