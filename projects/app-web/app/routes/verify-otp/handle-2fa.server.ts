import { redirect } from 'react-router';
import invariant from 'tiny-invariant';
import { graphql } from '~/gql/index.ts';
import { authSessionStorage } from '~/session/auth-session-storage.server.ts';
import { storeAuthPayload } from '~/session/store-auth-payload.ts';
import { verifySessionStorage } from '~/session/verify-session-storage.server.ts';
import { Routes } from '~/types.ts';
import { isMutationError } from '~/utils/is-mutation-error.ts';
import { HandleVerificationContext } from './types.ts';

const FinishLoginWith2FAMutation = graphql(/* GraphQL */ `
  mutation FinishLoginWith2FA($input: FinishLoginWith2FAInput!) {
    finishLoginWith2FA(input: $input) {
      ... on AuthPayload {
        accessToken
        refreshToken
        session {
          id
          expiresAt
        }
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

export async function handle2FA(ctx: HandleVerificationContext) {
  invariant(
    ctx.submission.status === 'success',
    'submission should be successful by now',
  );

  const { finishLoginWith2FA } = await ctx.client.request(
    FinishLoginWith2FAMutation,
    {
      input: {
        target: ctx.submission.value.target,
        transactionToken: ctx.transactionToken,
      },
    },
  );

  const verifySession = await verifySessionStorage.getSession(
    ctx.request.headers.get('cookie'),
  );

  if (isMutationError(finishLoginWith2FA)) {
    return redirect(Routes.Login, {
      headers: {
        'set-cookie': await verifySessionStorage.destroySession(verifySession),
      },
    });
  }

  const authSession = await authSessionStorage.getSession(
    ctx.request.headers.get('cookie'),
  );

  storeAuthPayload(authSession, finishLoginWith2FA);

  const headers = new Headers();

  headers.append(
    'set-cookie',
    await authSessionStorage.commitSession(authSession, {
      expires: new Date(finishLoginWith2FA.session.expiresAt),
    }),
  );

  headers.append(
    'set-cookie',
    await verifySessionStorage.destroySession(verifySession),
  );

  return redirect(Routes.Dashboard, { headers });
}
