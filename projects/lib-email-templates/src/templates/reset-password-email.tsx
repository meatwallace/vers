import { type ReactElement } from 'react';
import * as E from '@react-email/components';

interface Props {
  resetURL: string;
}

export function ResetPasswordEmail(props: Props): ReactElement {
  return (
    <E.Container>
      <E.Heading as="h1">
        <E.Text>Password Reset</E.Text>
      </E.Heading>
      <E.Link href={props.resetURL}>{props.resetURL}</E.Link>
    </E.Container>
  );
}
