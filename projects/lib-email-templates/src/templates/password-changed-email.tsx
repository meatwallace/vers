import type { ReactElement } from 'react';
import * as E from '@react-email/components';

interface Props {
  email: string;
}

export function PasswordChangedEmail(props: Props): ReactElement {
  return (
    <E.Container>
      <E.Heading as="h1">
        <E.Text>Password Changed</E.Text>
      </E.Heading>
      <E.Text>
        The password for your account ({props.email}) has been changed.
      </E.Text>
      <E.Text>
        If you did not make this change, please contact support immediately.
      </E.Text>
    </E.Container>
  );
}
