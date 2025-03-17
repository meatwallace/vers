import type { ReactElement } from 'react';
import * as E from '@react-email/components';

interface Props {
  email: string;
}

export function ExistingAccountEmail(props: Props): ReactElement {
  return (
    <E.Container>
      <E.Heading as="h1">
        <E.Text>You Already Have an Account</E.Text>
      </E.Heading>
      <E.Text>
        We noticed you tried to sign up with {props.email}, but you already have
        an account with us.
      </E.Text>
      <E.Text>
        If you&apos;ve forgotten your password, you can reset it using our
        password reset form.
      </E.Text>
      <E.Button
        href="https://versidle.com/forgot-password"
        style={{
          backgroundColor: '#000',
          borderRadius: '4px',
          color: '#fff',
          padding: '12px 20px',
          textDecoration: 'none',
        }}
      >
        Reset Password
      </E.Button>
    </E.Container>
  );
}
