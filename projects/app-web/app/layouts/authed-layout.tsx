import { Outlet } from 'react-router';
import { Header } from '~/components/header';
import { GetCurrentUser } from '~/data/queries/get-current-user';
import { createGQLClient } from '~/utils/create-gql-client.server';
import { requireAuth } from '~/utils/require-auth.server';
import { withErrorHandling } from '~/utils/with-error-handling';
import type { Route } from './+types/authed-layout';

export const loader = withErrorHandling(async (args: Route.LoaderArgs) => {
  const client = createGQLClient();

  await requireAuth(args.request, { client });

  const { getCurrentUser } = await client.request(GetCurrentUser, {});

  return { user: getCurrentUser };
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
