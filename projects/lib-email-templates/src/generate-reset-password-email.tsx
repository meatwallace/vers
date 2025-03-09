import * as E from '@react-email/components';
import { generateEmail } from './generate-email.ts';
import { ResetPasswordEmail } from './templates/reset-password-email.tsx';

interface Config {
  resetURL: string;
}

export async function generateResetPasswordEmail(config: Config) {
  return generateEmail({
    component: (
      <E.Html lang="en" dir="ltr">
        <ResetPasswordEmail resetURL={config.resetURL} />
      </E.Html>
    ),
  });
}
