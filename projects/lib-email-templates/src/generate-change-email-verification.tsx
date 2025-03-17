import * as E from '@react-email/components';
import { generateEmail } from './generate-email.ts';
import { ChangeEmailVerificationEmail } from './templates/change-email-verification.tsx';

interface Config {
  newEmail: string;
  verificationCode: string;
  verificationURL: string;
}

export async function generateChangeEmailVerificationEmail(config: Config) {
  return generateEmail({
    component: (
      <E.Html dir="ltr" lang="en">
        <ChangeEmailVerificationEmail
          newEmail={config.newEmail}
          verificationCode={config.verificationCode}
          verificationURL={config.verificationURL}
        />
      </E.Html>
    ),
  });
}
