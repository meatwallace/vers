import { Form } from 'react-router';
import { Brand } from './brand';
import { Button } from './button';
import * as styles from './header.css.ts';

type Props = {
  user: {
    name: string;
    firstName?: string | null;
  };
};

export function Header(props: Props) {
  return (
    <header className={styles.container}>
      <Brand size="small" />

      <span className={styles.userName}>
        {props.user.firstName ?? props.user.name}
      </span>

      <Form action="/auth/logout" method="post">
        <Button color="transparent" size="small">
          Log out
        </Button>
      </Form>
    </header>
  );
}
