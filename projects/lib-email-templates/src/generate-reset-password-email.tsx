import * as E from '@react-email/components';
import { generateEmail } from './generate-email.ts';
import { ResetPasswordEmail } from './templates/reset-password-email.tsx';

type Config = {
  verificationURL: string;
  otp: string;
};

export async function generateResetPasswordEmail(config: Config) {
  return generateEmail({
    component: (
      <E.Html lang="en" dir="ltr">
        <ResetPasswordEmail
          verificationURL={config.verificationURL}
          otp={config.otp}
        />
      </E.Html>
    ),
  });
}
