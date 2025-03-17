import type { ReactElement } from 'react';
import * as E from '@react-email/components';

export function ChangeEmailNotificationEmail(): ReactElement {
  return (
    <E.Container>
      <E.Heading as="h1">
        <E.Text>Email Address Changed</E.Text>
      </E.Heading>
      <E.Text>Your account&apos;s email address has been changed.</E.Text>
      <E.Hr />
      <E.Text>
        If you did not make this change, please contact support immediately as
        your account may have been compromised.
      </E.Text>
      <E.Text>
        For security reasons, this notification was sent to your previous email
        address.
      </E.Text>
    </E.Container>
  );
}
