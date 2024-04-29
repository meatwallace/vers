import { Form } from '@remix-run/react';
import { Button } from './button';

export function LogInButton() {
  return (
    <Form action="/auth/auth0" method="post">
      <Button variant="transparent">Log in</Button>
    </Form>
  );
}
