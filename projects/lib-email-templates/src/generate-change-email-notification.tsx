import * as E from '@react-email/components';
import { generateEmail } from './generate-email.ts';
import { ChangeEmailNotificationEmail } from './templates/change-email-notification.tsx';

export async function generateChangeEmailNotificationEmail() {
  return generateEmail({
    component: (
      <E.Html dir="ltr" lang="en">
        <ChangeEmailNotificationEmail />
      </E.Html>
    ),
  });
}
