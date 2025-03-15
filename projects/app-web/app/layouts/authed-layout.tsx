import { Outlet } from 'react-router';
import invariant from 'tiny-invariant';
import { Header } from '~/components/header';
import { GetCurrentUserQuery } from '~/data/queries/get-current-user';
import { createGQLClient } from '~/utils/create-gql-client.server';
import { handleGQLError } from '~/utils/handle-gql-error';
import { requireAuth } from '~/utils/require-auth.server';
import { withErrorHandling } from '~/utils/with-error-handling';
import type { Route } from './+types/authed-layout';

export const loader = withErrorHandling(async (args: Route.LoaderArgs) => {
  await requireAuth(args.request);

  const client = await createGQLClient(args.request);

  const result = await client.query(GetCurrentUserQuery, {});

  if (result.error) {
    handleGQLError(result.error);

    throw result.error;
  }

  invariant(result.data, 'if no error, there should be data');

  return { user: result.data.getCurrentUser };
});

export function AuthedLayout(props: Route.ComponentProps) {
  return (
    <>
      <Header user={props.loaderData.user} />
      <Outlet />
    </>
  );
}

export default AuthedLayout;
