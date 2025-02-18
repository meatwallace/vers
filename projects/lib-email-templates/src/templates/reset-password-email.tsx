import { type ReactElement } from 'react';
import * as E from '@react-email/components';

type Props = {
  verificationURL: string;
  otp: string;
};

export function ResetPasswordEmail(props: Props): ReactElement {
  return (
    <E.Container>
      <E.Heading as="h1">
        <E.Text>Password Reset</E.Text>
      </E.Heading>
      <E.Text>
        Here's your verification code: <strong>{props.otp}</strong>
      </E.Text>
      <E.Text>Or click the link:</E.Text>
      <E.Link href={props.verificationURL}>{props.verificationURL}</E.Link>
    </E.Container>
  );
}
