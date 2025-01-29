import { Form } from 'react-router';
import { Routes } from '~/types.ts';
import { Brand } from './brand';
import { Button } from './button';
import * as styles from './header.css.ts';

type Props = {
  user: {
    username: string;
    name?: string;
  };
};

export function Header(props: Props) {
  return (
    <header className={styles.container}>
      <Brand size="small" />

      <span className={styles.userName}>
        {props.user.name ?? props.user.username}
      </span>

      <Form action={Routes.Logout} method="post">
        <Button color="transparent" size="small">
          Log out
        </Button>
      </Form>
    </header>
  );
}
