import { Heading } from '@vers/design-system';
import { RouteErrorBoundary } from '~/components/route-error-boundary.tsx';
import { requireAuth } from '~/utils/require-auth.server.ts';
import { withErrorHandling } from '~/utils/with-error-handling.ts';
import type { Route } from './+types/route.ts';

export const meta: Route.MetaFunction = () => [
  {
    description: '',
    title: 'vers | Dashboard',
  },
];

export const loader = withErrorHandling(async (args: Route.LoaderArgs) => {
  await requireAuth(args.request);

  return {};
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Dashboard(props: Route.ComponentProps) {
  return (
    <>
      <Heading level={1}>Under Construction</Heading>
    </>
  );
}

export function ErrorBoundary() {
  return <RouteErrorBoundary />;
}

export default Dashboard;
