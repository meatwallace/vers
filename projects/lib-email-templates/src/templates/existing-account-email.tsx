import { type ReactElement } from 'react';
import * as E from '@react-email/components';

type Props = {
  email: string;
};

export function ExistingAccountEmail(props: Props): ReactElement {
  return (
    <E.Container>
      <h1>
        <E.Text>You Already Have an Account</E.Text>
      </h1>
      <p>
        <E.Text>
          We noticed you tried to sign up with {props.email}, but you already
          have an account with us.
        </E.Text>
      </p>
      <p>
        <E.Text>
          If you&apos;ve forgotten your password, you can reset it using our
          password reset form.
        </E.Text>
      </p>
      <E.Button
        href="https://chrononomicon.com/forgot-password"
        style={{
          padding: '12px 20px',
          backgroundColor: '#000',
          color: '#fff',
          borderRadius: '4px',
          textDecoration: 'none',
        }}
      >
        Reset Password
      </E.Button>
    </E.Container>
  );
}
