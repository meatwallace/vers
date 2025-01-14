import { Authenticator } from 'remix-auth';
import { OAuth2Strategy } from 'remix-auth-oauth2';
import invariant from 'tiny-invariant';
import { client } from './client';
import { graphql } from './gql';
import { User } from './gql/graphql';
import { isMutationError } from './utils';
import { Auth0UserInfo } from './types';
import { Auth0Strategy } from './auth/auth0-strategy';

export const authenticator = new Authenticator<User>();

invariant(process.env.AUTH0_CLIENT_SECRET, '$AUTH0_CLIENT_SECRET is required');

const config = {
  authorizationEndpoint: `https://${import.meta.env.VITE_AUTH0_DOMAIN}/authorize`,
  tokenEndpoint: `https://${import.meta.env.VITE_AUTH0_DOMAIN}/oauth/token`,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  redirectURI: import.meta.env.VITE_AUTH0_CALLBACK_URL,
  scopes: ['openid', 'profile', 'email'],
  audience: import.meta.env.VITE_AUTH0_AUDIENCE,
};

const auth0Strategy = new Auth0Strategy<User>(config, handleVerifySuccess);

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
  options: OAuth2Strategy.VerifyOptions,
): Promise<Omit<User, '__typename'>> {
  client.setHeader('authorization', `Bearer ${options.tokens.accessToken()}`);

  const auth0ProfileResponse = await fetch(
    `https://${import.meta.env.VITE_AUTH0_DOMAIN}/userinfo`,
    {
      headers: { Authorization: `Bearer ${options.tokens.accessToken()}` },
    },
  );

  const auth0Profile: Auth0UserInfo = await auth0ProfileResponse.json();

  invariant(auth0Profile.email, 'email is required');

  const { getOrCreateUser } = await client.request(GetOrCreateUserMutation, {
    input: { email: auth0Profile.email },
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

authenticator.use(auth0Strategy, 'auth0');
