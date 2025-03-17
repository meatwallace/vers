import type { ReactElement } from 'react';
import * as E from '@react-email/components';

interface Props {
  newEmail: string;
  verificationCode: string;
  verificationURL: string;
}

export function ChangeEmailVerificationEmail(props: Props): ReactElement {
  return (
    <E.Container>
      <E.Heading as="h1">
        <E.Text>Verify Your New Email Address</E.Text>
      </E.Heading>
      <E.Text>
        You&apos;ve requested to change your email address to{' '}
        <strong>{props.newEmail}</strong>. Please verify this email address to
        complete the change.
      </E.Text>
      <E.Text>
        Your verification code is: <strong>{props.verificationCode}</strong>
      </E.Text>
      <E.Text>Or click the link below to verify your email address:</E.Text>
      <E.Button href={props.verificationURL}>Verify Email Address</E.Button>
      <E.Hr />
      <E.Text>
        If you did not request this change, please ignore this email or contact
        support if you have concerns.
      </E.Text>
      <E.Text>This link will expire in 15 minutes.</E.Text>
    </E.Container>
  );
}
