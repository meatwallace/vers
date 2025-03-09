import * as E from '@react-email/components';
import { generateEmail } from './generate-email.ts';
import { WelcomeEmail } from './templates/welcome-email.tsx';

interface Config {
  verificationCode: string;
  verificationURL: string;
}

export async function generateWelcomeEmail(config: Config) {
  return generateEmail({
    component: (
      <E.Html dir="ltr" lang="en">
        <WelcomeEmail
          verificationCode={config.verificationCode}
          verificationURL={config.verificationURL}
        />
      </E.Html>
    ),
  });
}
