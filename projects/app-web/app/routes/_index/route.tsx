import { Form } from 'react-router';
import { Brand } from '~/components/brand.tsx';
import { Button } from '~/components/button.tsx';
import { RouteErrorBoundary } from '~/components/route-error-boundary.tsx';
import { Routes } from '~/types.ts';
import { requireAnonymous } from '~/utils/require-anonymous.server.ts';
import { withErrorHandling } from '~/utils/with-error-handling.ts';
import type { Route } from './+types/route.ts';
import * as styles from './route.css.ts';

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
      <main className={styles.container}>
        <section className={styles.heroSection}>
          <Brand className={styles.brand} size="large" />
          <p className={styles.heroDescription}>A tagline goes here.</p>
        </section>

        <section className={styles.authSection}>
          <Form action={Routes.Signup} method="post">
            <Button className={styles.signUpButton}>Signup</Button>
          </Form>
          <span className={styles.existingAccountText}>
            Already have an account?
          </span>
          <Form action={Routes.Login} method="post">
            <Button className={styles.logInButton} color="transparent">
              Log in
            </Button>
          </Form>
        </section>
      </main>
    </>
  );
}

export function ErrorBoundary() {
  return <RouteErrorBoundary />;
}

export default Index;
