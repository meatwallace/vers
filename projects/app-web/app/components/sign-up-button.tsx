import { Form } from '@remix-run/react';
import { Button } from './button';

export function SignUpButton() {
  return (
    <>
      <Form action="/auth/auth0?screen_hint=signup" method="post">
        <Button>Sign up</Button>
      </Form>
    </>
  );
}
