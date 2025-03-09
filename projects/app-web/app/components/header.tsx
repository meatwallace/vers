import { Form, Link } from 'react-router';
import { Routes } from '~/types.ts';
import { Brand } from './brand';
import { Button } from './button';
import * as styles from './header.css.ts';

interface Props {
  user: {
    name?: string;
    username: string;
  };
}

export function Header(props: Props) {
  return (
    <header className={styles.container}>
      <Brand size="small" />

      <Link className={styles.profileLink} to={Routes.Profile}>
        {props.user.name ?? props.user.username}
      </Link>

      <Form action={Routes.Logout} method="post">
        <Button color="transparent" size="small">
          Log out
        </Button>
      </Form>
    </header>
  );
}
