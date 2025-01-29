import * as E from '@react-email/components';
import { generateEmail } from './generate-email.ts';
import { WelcomeEmail } from './welcome-email.tsx';

type Config = {
  onboardingURL: string;
  otp: string;
};

export async function generateWelcomeEmail(config: Config) {
  return generateEmail({
    component: (
      <E.Html lang="en" dir="ltr">
        <WelcomeEmail onboardingURL={config.onboardingURL} otp={config.otp} />
      </E.Html>
    ),
  });
}
