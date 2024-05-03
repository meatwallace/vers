import { Authenticator } from 'remix-auth';
import {
  Auth0Strategy,
  Auth0Profile,
  Auth0ExtraParams,
} from 'remix-auth-auth0';
import { OAuth2StrategyVerifyParams } from 'remix-auth-oauth2';
import invariant from 'tiny-invariant';
import { client } from './client';
import { graphql } from './gql';
import { User } from './gql/graphql';
import { sessionStorage } from './session-storage.server';
import { isMutationError } from './utils';

export const authenticator = new Authenticator<User>(sessionStorage, {
  sessionKey: 'userID',
});

invariant(process.env.AUTH0_CLIENT_SECRET, '$AUTH0_CLIENT_SECRET is required');

const config = {
  callbackURL: import.meta.env.VITE_AUTH0_CALLBACK_URL,
  clientID: import.meta.env.VITE_AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  audience: import.meta.env.VITE_AUTH0_AUDIENCE,
};

const auth0Strategy = new Auth0Strategy(config, handleVerifySuccess);

const GetOrCreateUserMutation = graphql(/* GraphQL */ `
  mutation GetOrCreateUser($input: GetOrCreateUserInput!) {
    getOrCreateUser(input: $input) {
      ... on User {
        id
        name
        firstName
        email
        emailVerified
        createdAt
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

async function handleVerifySuccess(
  params: OAuth2StrategyVerifyParams<Auth0Profile, Auth0ExtraParams>,
): Promise<Omit<User, '__typename'>> {
  client.setHeader('authorization', `Bearer ${params.accessToken}`);

  const email = params.profile.emails?.[0].value;

  invariant(email, 'email is required');

  const { getOrCreateUser } = await client.request(GetOrCreateUserMutation, {
    input: { email },
  });

  if (isMutationError(getOrCreateUser)) {
    const error = new Error(getOrCreateUser.error.message);

    error.name = getOrCreateUser.error.title;

    // TODO(#16): capture via Sentry
    throw error;
  }

  const { __typename, ...user } = getOrCreateUser;

  return user;
}

authenticator.use(auth0Strategy);
