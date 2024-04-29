import { Form } from '@remix-run/react';
import { Button } from './button';

export function LogOutButton() {
  return (
    <>
      <Form action="/auth/logout" method="post">
        <Button>Log out</Button>
      </Form>
    </>
  );
}
