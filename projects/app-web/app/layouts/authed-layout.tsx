import { Outlet } from 'react-router';
import { css } from '@vers/styled-system/css';
import invariant from 'tiny-invariant';
import { Header } from '~/components/header';
import { GetCurrentUserQuery } from '~/data/queries/get-current-user';
import { getLoginPathWithRedirect } from '~/utils/get-login-path-with-redirect.server';
import { handleGQLError } from '~/utils/handle-gql-error';
import { logout } from '~/utils/logout.server';
import { requireAuth } from '~/utils/require-auth.server';
import { withErrorHandling } from '~/utils/with-error-handling';
import type { Route } from './+types/authed-layout';

export const loader = withErrorHandling(async (args: Route.LoaderArgs) => {
  await requireAuth(args.request);

  const result = await args.context.client.query(GetCurrentUserQuery, {});

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

const container = css({
  alignItems: 'center',
  display: 'flex',
  flex: '1',
  flexDirection: 'column',
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingTop: '6',
  width: {
    '2xl': '1/2',
    base: '4/5',
    lg: '2/3',
    md: '10/12',
    sm: '11/12',
    xl: '1/2',
  },
});

export function AuthedLayout(props: Route.ComponentProps) {
  return (
    <>
      <Header user={props.loaderData.user} />
      <main className={container}>
        <Outlet />
      </main>
    </>
  );
}

export default AuthedLayout;
