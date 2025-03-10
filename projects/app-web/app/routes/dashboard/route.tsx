import { RouteErrorBoundary } from '~/components/route-error-boundary.tsx';
import { createGQLClient } from '~/utils/create-gql-client.server.ts';
import { requireAuth } from '~/utils/require-auth.server.ts';
import { withErrorHandling } from '~/utils/with-error-handling.ts';
import type { Route } from './+types/route.ts';
import * as styles from './route.css.ts';

export const meta: Route.MetaFunction = () => [
  {
    description: '',
    title: 'Vers | Dashboard',
  },
];

export const loader = withErrorHandling(async (args: Route.LoaderArgs) => {
  const { request } = args;

  const client = createGQLClient();

  await requireAuth(request, { client });

  return {};
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Dashboard(props: Route.ComponentProps) {
  return (
    <>
      <main className={styles.container}>
        <h1>Dashboard</h1>
      </main>
    </>
  );
}

export function ErrorBoundary() {
  return <RouteErrorBoundary />;
}

export default Dashboard;
