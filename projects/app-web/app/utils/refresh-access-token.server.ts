import type { AuthUtilities } from '@urql/exchange-auth';
import { UnreachableCodeError } from '@vers/utils';
import invariant from 'tiny-invariant';
import { graphql } from '~/gql';
import { getLoginPathWithRedirect } from './get-login-path-with-redirect.server.ts';
import { isMutationError } from './is-mutation-error.ts';
import { logout } from './logout.server.ts';

const RefreshAccessTokenMutation = graphql(/* GraphQL */ `
  mutation RefreshAccessToken($input: RefreshAccessTokenInput!) {
    refreshAccessToken(input: $input) {
      ... on AuthPayload {
        accessToken
        refreshToken
        session {
          id
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

interface Context {
  refreshToken: string;
  utils: AuthUtilities;
}

interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  session: {
    id: string;
  };
}

export async function refreshAccessToken(
  request: Request,
  ctx: Context,
): Promise<AuthPayload> {
  const result = await ctx.utils.mutate(RefreshAccessTokenMutation, {
    input: {
      refreshToken: ctx.refreshToken,
    },
  });

  const isError =
    !!result.error || isMutationError(result.data?.refreshAccessToken);

  if (isError) {
    await logout(request, { redirectTo: getLoginPathWithRedirect(request) });

    throw new UnreachableCodeError('logout throws a redirect');
  }

  invariant(result.data && !isMutationError(result.data.refreshAccessToken));

  return result.data.refreshAccessToken;
}
