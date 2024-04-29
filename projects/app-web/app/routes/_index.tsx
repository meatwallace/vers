import { MetaFunction } from '@remix-run/node';
import { LogInButton, SignUpButton } from '../components';
import * as styles from './_index.css';

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
          <h1 className={styles.brandName}>
            Chron
            <img
              alt="Chrononomicon brand icon"
              src="/assets/images/brand-icon-light.png"
              className={styles.brandIcon}
            />
            nomicon
          </h1>
          <img
            alt="Book icon"
            className={styles.heroDescriptionIcon}
            src="/assets/images/icon-book.png"
          />
          <p className={styles.heroDescription}>
            Create immersive worlds and run your tabletop campaigns with ease.
          </p>
        </section>
      </main>
      <section className={styles.authSection}>
        <SignUpButton />
        <span className={styles.existingAccountText}>
          Already have an account?
        </span>
        <LogInButton />
      </section>
    </>
  );
}

export default Index;
