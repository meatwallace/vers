import { Form } from 'react-router';
import { type Route } from './+types/route.ts';
import { Brand } from '~/components/brand.tsx';
import { Button } from '~/components/button.tsx';
import { Routes } from '~/types.ts';
import { requireAnonymous } from '~/utils/require-anonymous.server.ts';
import * as styles from './route.css.ts';

export const meta: Route.MetaFunction = () => [
  {
    title: '',
    description: '',
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
          <Brand size="large" className={styles.brand} />
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
            <Button color="transparent" className={styles.logInButton}>
              Log in
            </Button>
          </Form>
        </section>
      </main>
    </>
  );
}

export default Index;
