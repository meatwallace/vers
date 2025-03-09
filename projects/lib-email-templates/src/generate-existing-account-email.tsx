import * as E from '@react-email/components';
import { generateEmail } from './generate-email.ts';
import { ExistingAccountEmail } from './templates/existing-account-email.tsx';

interface Config {
  email: string;
}

export async function generateExistingAccountEmail(config: Config) {
  return generateEmail({
    component: (
      <E.Html lang="en" dir="ltr">
        <ExistingAccountEmail email={config.email} />
      </E.Html>
    ),
  });
}
