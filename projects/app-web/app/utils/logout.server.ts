import { GraphQLClient } from 'graphql-request';
import { redirect } from 'react-router';
import { safeRedirect } from 'remix-utils/safe-redirect';
import { graphql } from '~/gql';
import { authSessionStorage } from '~/session/auth-session-storage.server';
import {
  SESSION_KEY_AUTH_ACCESS_TOKEN,
  SESSION_KEY_AUTH_SESSION_ID,
} from '~/session/consts';
import { Routes } from '~/types';
import { combineHeaders } from './combine-headers.server.ts';
import { createGQLClient } from './create-gql-client.server.ts';

type Context = {
  client?: GraphQLClient;
  redirectTo?: string;
  responseInit?: ResponseInit;
};

const deleteSessionMutation = graphql(/* GraphQL */ `
  mutation DeleteSession($input: DeleteSessionInput!) {
    deleteSession(input: $input) {
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

export async function logout(request: Request, ctx: Context = {}) {
  const client = ctx.client ?? createGQLClient();
  const redirectTo = ctx.redirectTo ?? Routes.Index;

  const authSession = await authSessionStorage.getSession(
    request.headers.get('cookie'),
  );

  const accessToken = authSession.get(SESSION_KEY_AUTH_ACCESS_TOKEN);
  const sessionID = authSession.get(SESSION_KEY_AUTH_SESSION_ID);

  client.setHeader('authorization', `Bearer ${accessToken}`);

  if (sessionID) {
    // if we fail our server side session cleanup, ignore error's and continue.
    try {
      await client.request(deleteSessionMutation, {
        input: {
          id: sessionID,
        },
      });
    } catch (error) {
      // TODO(#16): capture error with sentry
      console.error(error);
    }
  }

  throw redirect(safeRedirect(redirectTo), {
    ...ctx.responseInit,
    headers: combineHeaders(
      { 'set-cookie': await authSessionStorage.destroySession(authSession) },
      ctx.responseInit?.headers,
    ),
  });
}
