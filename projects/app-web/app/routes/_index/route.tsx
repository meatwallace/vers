import { Form } from 'react-router';
import { Brand } from '~/components/brand.tsx';
import { Button } from '~/components/button.tsx';
import { Routes } from '~/types.ts';
import { requireAnonymous } from '~/utils/require-anonymous.server.ts';
import { type Route } from './+types/route.ts';
import * as styles from './route.css.ts';

export const meta: Route.MetaFunction = () => [
  {
    description: '',
    title: '',
  },
];

export async function loader({ request }: Route.LoaderArgs) {
  return requireAnonymous(request);
}

export function Index() {
  return (
    <>
      <main className={styles.container}>
        <section className={styles.heroSection}>
          <Brand className={styles.brand} size="large" />
          <img
            alt="Book icon"
            className={styles.heroDescriptionIcon}
            src="/assets/images/icon-book.png"
          />
          <p className={styles.heroDescription}>
            Create immersive worlds and run your tabletop campaigns with ease.
          </p>
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

export default Index;
