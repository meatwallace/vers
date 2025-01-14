import { MetaFunction } from 'react-router';
import { Form } from 'react-router';
import { Brand, Button } from '../components';
import * as styles from './_index.css.ts';
import { Routes } from '../types.ts';

export const meta: MetaFunction = () => [
  {
    title: '',
    description: '',
  },
];

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
          <Form action={`${Routes.AuthAuth0}?screen_hint=signup`} method="post">
            <Button className={styles.signUpButton}>Sign up</Button>
          </Form>
          <span className={styles.existingAccountText}>
            Already have an account?
          </span>
          <Form action={Routes.AuthAuth0} method="post">
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
