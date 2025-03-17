import { Outlet } from 'react-router';
import invariant from 'tiny-invariant';
import { Header } from '~/components/header';
import { GetCurrentUserQuery } from '~/data/queries/get-current-user';
import { createGQLClient } from '~/utils/create-gql-client.server';
import { getLoginPathWithRedirect } from '~/utils/get-login-path-with-redirect.server';
import { handleGQLError } from '~/utils/handle-gql-error';
import { logout } from '~/utils/logout.server';
import { requireAuth } from '~/utils/require-auth.server';
import { withErrorHandling } from '~/utils/with-error-handling';
import type { Route } from './+types/authed-layout';

export const loader = withErrorHandling(async (args: Route.LoaderArgs) => {
  await requireAuth(args.request);

  const client = await createGQLClient(args.request);

  const result = await client.query(GetCurrentUserQuery, {});

  if (result.error) {
    handleGQLError(result.error);

    // if we get an error trying to fetch our current user, just logout
    // and redirect back to where we are
    await logout(args.request, {
      redirectTo: getLoginPathWithRedirect(args.request),
    });
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
