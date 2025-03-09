import { redirect } from 'react-router';
import invariant from 'tiny-invariant';
import { graphql } from '~/gql/gql.ts';
import { verifySessionStorage } from '~/session/verify-session-storage.server.ts';
import { Routes } from '~/types.ts';
import { type HandleVerificationContext } from './types.ts';

const FinishDisable2FAMutation = graphql(/* GraphQL */ `
  mutation FinishDisable2FA($input: FinishDisable2FAInput!) {
    finishDisable2FA(input: $input) {
      ... on MutationSuccess {
        success
      }

      ... on MutationErrorPayload {
        error {
          title
          message
        }
      }
    }
  }
`);

export async function handle2FADisable(ctx: HandleVerificationContext) {
  invariant(
    ctx.submission.status === 'success',
    'submission should be successful by now',
  );

  const verifySession = await verifySessionStorage.getSession(
    ctx.request.headers.get('cookie'),
  );

  // clean up the pending transaction ID
  verifySession.unset('transactionID');

  await ctx.client.request(FinishDisable2FAMutation, {
    input: {
      transactionToken: ctx.transactionToken,
    },
  });

  // regardless of the outcome, redirect to our profile route to show the user the result.
  // if we failed, its low effort to have them try again.
  return redirect(Routes.Profile, {
    headers: {
      'set-cookie': await verifySessionStorage.destroySession(verifySession),
    },
  });
}
