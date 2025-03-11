import { Form, Link } from 'react-router';
import { Routes } from '~/types.ts';
import { Brand } from './brand';
import { Button } from './button';

interface Props {
  user: {
    name?: string;
    username: string;
  };
}

export function Header(props: Props) {
  return (
    <header>
      <Brand />

      <Link to={Routes.Profile}>{props.user.name ?? props.user.username}</Link>

      <Form action={Routes.Logout} method="post">
        <Button>Log out</Button>
      </Form>
    </header>
  );
}
