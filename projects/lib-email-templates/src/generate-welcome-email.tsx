import * as E from '@react-email/components';
import { generateEmail } from './generate-email.ts';
import { WelcomeEmail } from './templates/welcome-email.tsx';

interface Config {
  verificationURL: string;
  verificationCode: string;
}

export async function generateWelcomeEmail(config: Config) {
  return generateEmail({
    component: (
      <E.Html lang="en" dir="ltr">
        <WelcomeEmail
          verificationURL={config.verificationURL}
          verificationCode={config.verificationCode}
        />
      </E.Html>
    ),
  });
}
