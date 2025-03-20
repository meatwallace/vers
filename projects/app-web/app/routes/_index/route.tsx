import { Link as RRLink } from 'react-router';
import { Brand, Button, Link, Text } from '@vers/design-system';
import { css } from '@vers/styled-system/css';
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
  return requireAnonymous(args.request);
});

const pageInfo = css({
  marginBottom: '8',
  textAlign: 'center',
});

const signUpButton = css({
  marginBottom: '5',
});

const accountSection = css({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
});

const inlineBrand = css({
  color: 'sky.300',
});

export function Index() {
  return (
    <>
      <section className={pageInfo}>
        <Brand size="xl" />
        <Text bold>Fight stuff. Find loot. Get stronger.</Text>
        <Text>
          <span className={inlineBrand}>vers</span> is a fantasy idle RPG with
          MMO elements, heavily inspired by Path of Exile.
        </Text>
      </section>

      <section className={accountSection}>
        <Button
          as={RRLink}
          className={signUpButton}
          to={Routes.Signup}
          variant="primary"
        >
          Signup
        </Button>
        <Text>Already have an account?</Text>
        <Link to={Routes.Login}>Login</Link>
      </section>
    </>
  );
}

export function ErrorBoundary() {
  return <RouteErrorBoundary />;
}

export default Index;
