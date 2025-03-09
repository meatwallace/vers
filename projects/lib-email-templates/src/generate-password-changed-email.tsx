import * as E from '@react-email/components';
import { generateEmail } from './generate-email.ts';
import { PasswordChangedEmail } from './templates/password-changed-email.tsx';

interface Config {
  email: string;
}

export async function generatePasswordChangedEmail(config: Config) {
  return generateEmail({
    component: (
      <E.Html lang="en" dir="ltr">
        <PasswordChangedEmail email={config.email} />
      </E.Html>
    ),
  });
}
