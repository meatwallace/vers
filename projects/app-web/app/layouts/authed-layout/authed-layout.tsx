import { Outlet } from 'react-router';
import { Header } from '~/components/header';
import { SideNavigation } from '~/components/side-navigation';
import { requireAuth } from '~/utils/require-auth.server.ts';
import { withErrorHandling } from '~/utils/with-error-handling';
import type { Route } from './+types/authed-layout';
import * as styles from './authed-layout.styles.ts';

export const loader = withErrorHandling(async (args: Route.LoaderArgs) => {
  await requireAuth(args.request);
});

export function AuthedLayout() {
  return (
    <div className={styles.container}>
      <Header />
      <SideNavigation />
      <main className={styles.contentContainer}>
        <Outlet />
      </main>
    </div>
  );
}

export default AuthedLayout;
