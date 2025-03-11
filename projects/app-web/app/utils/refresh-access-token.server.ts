import { GraphQLClient } from 'graphql-request';
import invariant from 'tiny-invariant';
import { graphql } from '~/gql';
import { Routes } from '~/types';
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

interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  sessionID: string;
}

interface Context {
  client: GraphQLClient;
  refreshToken: string;
}

export async function refreshAccessToken(
  request: Request,
  ctx: Context,
): Promise<AuthPayload> {
  const { refreshAccessToken } = await ctx.client.request(
    RefreshAccessTokenMutation,
    {
      input: {
        refreshToken: ctx.refreshToken,
      },
    },
  );

  if (isMutationError(refreshAccessToken)) {
    await logout(request, { client: ctx.client, redirectTo: Routes.Login });
  }

  invariant('session' in refreshAccessToken, 'session must be in payload');

  return {
    accessToken: refreshAccessToken.accessToken,
    refreshToken: refreshAccessToken.refreshToken,
    sessionID: refreshAccessToken.session.id,
  };
}
