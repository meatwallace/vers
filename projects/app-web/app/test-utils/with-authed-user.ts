import { LoaderFunction, ActionFunction } from 'react-router';
import { GraphQLClient } from 'graphql-request';
import { createAuthedUser } from '~/test-utils/create-authed-user.ts';

type Config = {
  client?: GraphQLClient;
  sessionID?: string;
  user?: {
    id?: string;
    email?: string;
    password?: string;
    name?: string;
  };
};

export function withAuthedUser(
  dataFn: LoaderFunction | ActionFunction,
  config: Config = {},
): LoaderFunction | ActionFunction {
  return async ({ request, ...rest }) => {
    await createAuthedUser({
      request,
      client: config.client,
      user: config.user,
      sessionID: config.sessionID,
    });

    return dataFn({ request, ...rest });
  };
}
