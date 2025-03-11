import { Brand } from '~/components/brand.tsx';
import { Link } from '~/components/link.tsx';
import { RouteErrorBoundary } from '~/components/route-error-boundary.tsx';
import { Routes } from '~/types.ts';
import { requireAnonymous } from '~/utils/require-anonymous.server.ts';
import { withErrorHandling } from '~/utils/with-error-handling.ts';
import type { Route } from './+types/route.ts';

export const meta: Route.MetaFunction = () => [
  {
    description: '',
    title: 'Vers',
  },
];

export const loader = withErrorHandling(async (args: Route.LoaderArgs) => {
  const { request } = args;

  return requireAnonymous(request);
});

export function Index() {
  return (
    <>
      <main>
        <section>
          <Brand />
          <p>A tagline goes here.</p>
        </section>

        <section>
          <Link to={Routes.Signup}>Signup</Link>
          <span>Already have an account?</span>
          <Link to={Routes.Login}>Log in</Link>
        </section>
      </main>
    </>
  );
}

export function ErrorBoundary() {
  return <RouteErrorBoundary />;
}

export default Index;
